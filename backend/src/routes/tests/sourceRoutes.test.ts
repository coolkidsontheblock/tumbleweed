import request from 'supertest';
import { app }  from '../../index';
import { formatDateForFrontend } from '../../helpers/consumerHelper';
import { createTopicsForKafka } from '../../kafka/kafkaAdmin';
import { verifyPassword } from '../../helpers/encrypt';
import axios from 'axios';
import { 
  createOutboxTableInSource, 
  getAllConnectors, 
  getConfigData, 
  getConnectorWithSlotNameandPW, 
  postConfigDataToDB 
} from '../../helpers/sourceHelper';
import { 
  validateDBCredentials, 
  validateSourceDetails 
} from '../../helpers/validation';
import { 
  ConnectorError, 
  DatabaseError, 
  InvalidCredentialsError 
} from '../../utils/errors';
  
jest.mock('../../helpers/validation');
jest.mock('../../kafka/kafkaAdmin');
jest.mock('../../helpers/sourceHelper');
jest.mock('../../helpers/consumerHelper');
jest.mock('../../helpers/encrypt');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedServices = jest.mocked({
  getAllConnectors,
  postConfigDataToDB,
  getConnectorWithSlotNameandPW,
  validateDBCredentials,
  createOutboxTableInSource,
  getConfigData,
  formatDateForFrontend,
  validateSourceDetails,
  createTopicsForKafka,
  verifyPassword
});

const mockSourceData = {
  message: '1 sources found.',
  data: [{
    database_dbname: 'testdatabase',
    database_hostname: 'testhostname',
    database_port: 5432,
    database_server_name: 'testservername',
    database_user: 'testuser',
    date_created: 'November 15, 2024 at 09:51 AM PST',
    name: 'testname',
    slot_name: 'tumbleweed_testname'
  }]
}

const mockSourceDataWithPW = {
  name: 'testname',
  database_hostname: 'testhostname',
  database_port: 5432,
  database_user: 'testuser',
  database_password: 'testpassword',
  database_dbname: 'testdatabase',
  database_server_name: 'testservername',
  topics: ['products']
}

const mockPGSourceData = {
  "name": mockSourceDataWithPW.name,
  "config": {
    "plugin.name": "pgoutput",
    "database.hostname": mockSourceDataWithPW.database_hostname,
    "database.port": mockSourceDataWithPW.database_port,
    "database.user": mockSourceDataWithPW.database_user,
    "database.password": mockSourceDataWithPW.database_password,
    "database.dbname": mockSourceDataWithPW.database_dbname,
    "database.server.name": mockSourceDataWithPW.database_server_name,
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "table.include.list": "public.outbox",
    "tombstone.on.delete": "false",
    "slot.name": `tumbleweed_${mockSourceDataWithPW.name}`,
    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
    "transforms.outbox.table.fields.additional.placement": "type:envelope:type",
    "schema.history.internal.kafka.bootstrap.servers": "kafka-1:19092,kafka-2:19092,kafka-3:19092",
    "schema.history.internal.kafka.topic": "schema-changes.inventory",
    "key.converter": "io.apicurio.registry.utils.converter.ExtJsonConverter",
    "key.converter.apicurio.registry.url": "http://apicurio:8080/apis/registry/v2",
    "key.converter.apicurio.registry.auto-register": "true",
    "key.converter.apicurio.registry.find-latest": "true",
    "value.converter": "io.apicurio.registry.utils.converter.ExtJsonConverter",
    "value.converter.apicurio.registry.url": "http://apicurio:8080/apis/registry/v2",
    "value.converter.apicurio.registry.auto-register": "true",
    "value.converter.apicurio.registry.find-latest": "true",
    "topic.prefix": "app",
    "heartbeat.action.query": `INSERT INTO heartbeat (timestamp, hostname) VALUES (now(), dbname: ${mockSourceDataWithPW.database_dbname}, user: ${mockSourceDataWithPW.database_user})`,
    "heartbeat.interval.ms": 300000,
    "publication.name": "dbz_publication"
  }
}

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /api/sources', () => {
  it('Should return a message and list of sources', async () => {
    mockedServices.getAllConnectors.mockResolvedValue(mockSourceData.data);

    const response = await request(app).get('/api/sources');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: mockSourceData.message,
      data: expect.arrayContaining([
        expect.objectContaining(mockSourceData.data[0])
      ])
    });
  });

  it('Should handle errors when retrieving sources', async () => {
    mockedServices.getAllConnectors.mockRejectedValue(new Error());
    console.error = jest.fn();

    const response = await request(app).get('/api/sources');

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('An error occurred retrieving all sources'));
  });
});

describe('POST api/sources/new_source', () => {
  it('Should create a new source', async () => {
    mockedServices.validateDBCredentials.mockResolvedValue({ success: true, message: 'Credentials verified successfully', status: 200});
    mockedServices.createOutboxTableInSource.mockResolvedValue({ success: true, message: 'Outbox and heartbeat tables were successfully created or already exist.', status: 200});
    mockedServices.getConfigData.mockReturnValue(mockPGSourceData);
    mockedServices.validateSourceDetails.mockResolvedValue();
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ status: 201 });
    mockedServices.postConfigDataToDB.mockResolvedValue(mockSourceData.data[0]);
    mockedServices.createTopicsForKafka.mockResolvedValue();
    mockedServices.formatDateForFrontend.mockReturnValue(mockSourceData.data[0].date_created);

    const response = await request(app)
      .post('/api/sources/new_source')
      .send(mockSourceDataWithPW)

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Connector created',
      data: expect.objectContaining(mockSourceData.data[0])
    });
  });

  it('Should handle errors with invalid database credentials', async () => {
    mockedServices.validateDBCredentials.mockRejectedValue(new InvalidCredentialsError('Encountered error when validating db credentials', 500));

    const response = await request(app)
      .post('/api/sources/new_source')
      .send(mockSourceDataWithPW)
    
    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Encountered error when validating db credentials'));
  });

  it('Should handle errors when creating outbox/heartbeat table in source', async () => {
    mockedServices.validateDBCredentials.mockResolvedValue({ success: true, message: 'Credentials verified successfully', status: 200});
    mockedServices.createOutboxTableInSource.mockRejectedValue(new InvalidCredentialsError('An unknown error occurred when creating outbox/heartbeat tables', 500));

    const response = await request(app)
      .post('/api/sources/new_source')
      .send(mockSourceDataWithPW)
    
    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('An unknown error occurred when creating outbox/heartbeat tables'));
  });

  it('Should handle errors when adding source to database', async () => {
    mockedServices.validateDBCredentials.mockResolvedValue({ success: true, message: 'Credentials verified successfully', status: 200});
    mockedServices.createOutboxTableInSource.mockResolvedValue({ success: true, message: 'Outbox and heartbeat tables were successfully created or already exist.', status: 200});
    mockedServices.getConfigData.mockReturnValue(mockPGSourceData);
    mockedServices.validateSourceDetails.mockResolvedValue();
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ status: 201 });
    mockedServices.postConfigDataToDB.mockRejectedValue(new DatabaseError('There was an error adding a new connector to the database'));

    const response = await request(app)
      .post('/api/sources/new_source')
      .send(mockSourceDataWithPW)
    
    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('There was an error adding a new connector to the database'));
  });

  it('Should handle other errors gracefully', async () => {
    mockedServices.validateDBCredentials.mockRejectedValue(new Error());

    const response = await request(app)
      .post('/api/sources/new_source')
      .send(mockSourceDataWithPW)
    
    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('There was an error adding a new connector'));
  });
});

describe('DELETE /api/sources', () => {
  const mockDeleteInputData = {
    source_name: 'testsource',
    database_password: 'testpassword'
  }

  const mockDeleteSource = {
    name: 'testname',
    database_hostname: 'testhostname',
    database_port: 5432,
    database_user: 'testuser',
    database_password: 'testpassword',
    database_dbname: 'testdbname',
    database_server_name: 'testservername',
    date_created: 'November 15, 2024 at 09:51 AM PST',
    slot_name: 'testslotname'
  }

  it('Should delete a source', async () => {
    mockedServices.getConnectorWithSlotNameandPW.mockResolvedValue(mockDeleteSource);
    mockedServices.verifyPassword.mockResolvedValue(true);

    const response = await request(app)
      .delete(`/api/sources`)
      .send(mockDeleteInputData);

    expect(response.status).toBe(201);
    expect(response.text).toBe("Connector 'testname' deleted!");
  });

  it('Should handle when a source name doesnt exist', async () => {
    mockedServices.getConnectorWithSlotNameandPW.mockRejectedValue(new ConnectorError('No Connector by that name exists'));

    const response = await request(app)
      .delete(`/api/sources`)
      .send(mockDeleteInputData);

      expect(response.status).toBe(500);
      expect(console.error).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('An error occurred when deleting connector: Error: No Connector by that name exists'));
  });

  it('Should handle when passwords dont match', async () => {
    mockedServices.getConnectorWithSlotNameandPW.mockResolvedValue(mockDeleteSource);
    mockedServices.verifyPassword.mockResolvedValue(false);

    const response = await request(app)
      .delete(`/api/sources`)
      .send(mockDeleteInputData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Password does not match, please try again');
  });

  it('Should handle other errors gracefully', async () => {
    mockedServices.getConnectorWithSlotNameandPW.mockRejectedValue(new Error());

    const response = await request(app)
      .delete('/api/sources/')
      .send(mockSourceDataWithPW)
    
    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('An error occurred when deleting connector'));
  });
});
