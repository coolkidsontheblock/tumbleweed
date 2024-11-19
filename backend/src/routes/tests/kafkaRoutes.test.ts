import request from 'supertest';
import { kafkaApp }  from '../../index';
import { getConsumerByGroupId } from '../../helpers/consumerHelper';
import { getKafkaBrokerEndpoints } from '../../kafka/kafkaAdmin';
import { 
  consumeMessages, 
  createConsumer, 
  initializeKafka 
} from '../../kafka/kafkaClientSSEConnect';

jest.mock('../../helpers/consumerHelper');
jest.mock('../../kafka/kafkaAdmin');
jest.mock('../../kafka/kafkaClientSSEConnect');

const mockedServices = jest.mocked({
  getConsumerByGroupId,
  getKafkaBrokerEndpoints,
  createConsumer,
  consumeMessages,
  initializeKafka
});

const mockConsumerData = {
  name: 'testuser',
  description: 'optionaldescription',
  tumbleweed_endpoint: 'http://localhost/tumbleweed/testuser',
  kafka_client_id: 'testuser-client',
  kafka_broker_endpoints: ['kafka-1:19092', 'kafka-2:19092', 'kafka-3:19092'],
  kafka_group_id: 'testuser',
  subscribed_topics: ['orders', 'products'],
  received_message_count: 0,
  date_created: 'November 15, 2024 at 09:51 AM PST'
}

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /tumbleweed', () => {
  it('Should set appropriate headers to create an open connection in order to stream messages', async () => {
    const mockConsumer = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      stop: jest.fn(),
      run: jest.fn(),
      commitOffsets: jest.fn(),
      pause: jest.fn(),
      seek: jest.fn(),
      describeGroup: jest.fn(),
      paused: jest.fn(),
      on: jest.fn(),
      resolved: jest.fn(),
      logger: jest.fn(),
      resume: jest.fn(),
      events: {} as any
    }
    
    mockedServices.getConsumerByGroupId.mockResolvedValue(mockConsumerData);
    mockedServices.initializeKafka.mockResolvedValue(undefined);
    mockedServices.getKafkaBrokerEndpoints.mockResolvedValue(mockConsumerData.kafka_broker_endpoints);
    mockedServices.createConsumer.mockResolvedValue(mockConsumer);
    mockedServices.consumeMessages.mockImplementation(async (_consumer, res, _name): Promise<null | undefined> => {
      res.write('data: test message');
      res.end();
      return;
    });

    const response = await request(kafkaApp).get(`/tumbleweed/testuser`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/event-stream');
    expect(response.headers['cache-control']).toBe('no-cache');
    expect(response.headers['connection']).toBe('keep-alive');
  });

  it('Should handle errors when consumer is not found', async () => {
    mockedServices.getConsumerByGroupId.mockResolvedValue(undefined);

    const response = await request(kafkaApp).get('/tumbleweed/testuser');

    expect(response.status).toBe(404);
    expect(response.text).toBe("Consumer not found");
  });

  it('Should handle error retrieving all topics', async () => {
    mockedServices.getKafkaBrokerEndpoints.mockResolvedValue(mockConsumerData.kafka_broker_endpoints);
    mockedServices.getConsumerByGroupId.mockResolvedValue(mockConsumerData);
    mockedServices.createConsumer.mockRejectedValue(new Error());
    console.error = jest.fn();

    const response = await request(kafkaApp).get('/tumbleweed/testuser');

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('There was an error getting all topics'));
  });
});
