import request from 'supertest';
import { app }  from '../../index';
import { getTopicsFromKafka } from '../../kafka/kafkaAdmin';
import { getInfoForAllTopics, 
         getTopicByName } from '../../helpers/topicHelper';

jest.mock('../../helpers/consumerHelper');
jest.mock('../../kafka/kafkaAdmin');
jest.mock('../../helpers/topicHelper');

const mockedServices = jest.mocked({
  getTopicsFromKafka,
  getInfoForAllTopics,
  getTopicByName
});

const mockTopicsData = {
  message: '1 topics Found.',
  data: [{
    topic: 'testTopic',
    subscribed_consumers: ['consumer1', 'consumer2'],
    date_added: 'November 15, 2024 at 09:51 AM PST',
    message_count: 10
  }]
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /api/topics', () => {
  it('Should return a message and list of topics', async () => {
    mockedServices.getTopicsFromKafka.mockResolvedValue(['products']);
    mockedServices.getInfoForAllTopics.mockResolvedValue(mockTopicsData.data);
    
    const response = await request(app).get('/api/topics');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: mockTopicsData.message,
      data: expect.arrayContaining([
        expect.objectContaining(mockTopicsData.data[0])
      ])
    });
  });

  it('Should return appropriate messsage and status when there are no topics', async () => {
    mockedServices.getTopicsFromKafka.mockResolvedValue([]);

    const response = await request(app).get('/api/topics');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "No topics found.",
      data: []
    });
  });

  it('Should handle when there is an error getting all topics', async () => {
    mockedServices.getTopicsFromKafka.mockRejectedValue(new Error());
    console.error = jest.fn();

    const response = await request(app).get('/api/topics');

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('An error occurred retrieving all topics'));
  });
});

describe('DELETE /api/topics', () => {
  it('Should delete a topic', async () => {
    const mockTopic = {
      name: 'testtopic',
      subscribed_consumers: [],
      date_added: 'November 15, 2024 at 09:51 AM PST'
    }
    mockedServices.getTopicByName.mockResolvedValue(mockTopic);

    const response = await request(app).delete(`/api/topics/testtopic`);

    expect(response.status).toBe(201);
    expect(response.text).toBe("Topic 'testtopic' deleted!");
  });

  it('Should handle when consumer name doesnt exist', async () => {
    mockedServices.getTopicByName.mockResolvedValue(undefined);
    
    const response = await request(app).delete(`/api/topics/testuser`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No Topic by that name exists');
  });

  it('Should handle database errors gracefully', async () => {
    mockedServices.getTopicByName.mockRejectedValue(new Error());
    console.error = jest.fn();

    const response = await request(app).delete(`/api/topics/testuser`);

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('An error occurred when deleting the topic'));
  });
});
