import request from 'supertest';
import { app }  from '../../index';
import { validateConsumerData } from '../../helpers/validation';
import { getKafkaBrokerEndpoints } from '../../kafka/kafkaAdmin';
import { deleteConsumerByName, 
         formatDateForFrontend, 
         getAllConsumerInfo, 
         getAllConsumersByName, 
         postConsumerToDB } from '../../helpers/consumerHelper';

jest.mock('../../helpers/consumerHelper');
jest.mock('../../kafka/kafkaAdmin');

const mockedServices = jest.mocked({
  getAllConsumerInfo,
  postConsumerToDB,
  formatDateForFrontend,
  getAllConsumersByName,
  deleteConsumerByName,
  validateConsumerData,
  getKafkaBrokerEndpoints
});

const mockConsumerData = {
  message: '1 Consumers Found.',
  data: [{
    name: 'testuser',
    description: 'optionaldescription',
    tumbleweed_endpoint: 'http://localhost/tumbleweed/testuser',
    kafka_client_id: 'testuser-client',
    kafka_broker_endpoints: ['kafka-1:19092', 'kafka-2:19092', 'kafka-3:19092'],
    kafka_group_id: 'testuser',
    subscribed_topics: ['orders', 'products'],
    received_message_count: 0,
    date_created: 'November 15, 2024 at 09:51 AM PST'
  }]
}

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /api/consumers', () => {
  it('Should return a message and list of consumers', async () => {
    mockedServices.getAllConsumerInfo.mockResolvedValue(mockConsumerData.data);

    const response = await request(app).get('/api/consumers');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: mockConsumerData.message,
      data: expect.arrayContaining([
        expect.objectContaining(mockConsumerData.data[0])
      ])
    });
  });

  it('Should handle errors when retrieving consumers', async () => {
    mockedServices.getAllConsumerInfo.mockRejectedValue(new Error());
    console.error = jest.fn();

    const response = await request(app).get('/api/consumers');

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('An error occurred retrieving all consumers'));
  });
});

describe('POST /api/consumers/new_consumer', () => {
  const consumerInputData = {
    name: 'testuser',
    description: '',
    kafka_group_id: 'testuser',
    subscribed_topics: ['orders', 'products']
  };

  it('Should create a new consumer', async () => {
    mockedServices.getKafkaBrokerEndpoints.mockResolvedValue(mockConsumerData.data[0].kafka_broker_endpoints);
    mockedServices.postConsumerToDB.mockResolvedValue(mockConsumerData.data[0]);
    mockedServices.formatDateForFrontend.mockReturnValue(mockConsumerData.data[0].date_created);

    const response = await request(app)
      .post('/api/consumers/new_consumer')
      .send(consumerInputData)

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Consumer created',
      data: expect.objectContaining(mockConsumerData.data[0])
    });
  });

  it('Should handle errors when adding new consumer', async () => {
    mockedServices.postConsumerToDB.mockRejectedValue(new Error());
    console.error = jest.fn();

    const response = await request(app)
      .post('/api/consumers/new_consumer')
      .send(consumerInputData)

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('There was an error adding a new consumer to the database'));
  });
});

describe('DELETE /api/consumers', () => {
  it('Should delete a consumer', async () => {
    mockedServices.getAllConsumersByName.mockResolvedValue(mockConsumerData.data[0]);
    const response = await request(app).delete(`/api/consumers/testuser`);

    expect(response.status).toBe(201);
    expect(response.text).toBe("Consumer 'testuser' deleted!");
  });

  it('Should handle when consumer name doesnt exist', async () => {
    mockedServices.getAllConsumersByName.mockResolvedValue(undefined);
    const response = await request(app).delete(`/api/consumers/testuser`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No Consumer by that name exists');
  });

  it('Should handle database errors gracefully', async () => {
    mockedServices.getAllConsumersByName.mockRejectedValue(new Error());
    console.error = jest.fn();
    const response = await request(app).delete(`/api/consumers/testuser`);

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('There was an error deleting the consumer'));
  });
});
