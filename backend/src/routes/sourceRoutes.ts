import axios from 'axios';
import express from 'express';
import {
  getConfigData,
  postConfigDataToDB,
  getAllConnectors,
  deleteConnectorByName,
  createOutboxTableInSource,
  deleteReplicationSlot,
  getConnectorWithSlotNameandPW
} from '../helpers/sourceHelper';
import { formatDateForFrontend } from '../helpers/consumerHelper';
import { PGCredentials } from '../types/sourceTypes';
import { validateSourceDetails, validateDBCredentials } from '../helpers/validation';
import { ConnectorError, InvalidCredentialsError } from '../utils/errors';
import { createTopicsForKafka } from '../kafka/kafkaAdmin';
import { verifyPassword } from '../helpers/encrypt';

const router = express.Router();

const destination = process.env.NODE_ENV === 'production'
      ? 'http://connect:8083/connectors' 
      : 'http://localhost:8083/connectors';

router.get('/', async (_, res, next) => {
  try {     
    await axios.get(destination);
    const sourceInfo = await getAllConnectors() || [];
    res.status(200).send({
      message: `${sourceInfo.length} sources found.`,
      data: sourceInfo
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/new_source', async (req, res, next) => {
  const sourceDetails = req.body;
  const credentials: PGCredentials = {
    database_user: sourceDetails.database_user,
    database_password: sourceDetails.database_password,
    database_dbname: sourceDetails.database_dbname,
    database_port: sourceDetails.database_port,
    database_hostname: sourceDetails.database_hostname,
  };

  try {
    const validCredentials = await validateDBCredentials(credentials);

    if (!validCredentials.success) {
      throw new InvalidCredentialsError(validCredentials.message, validCredentials.status);
    }

    const createOutbox = await createOutboxTableInSource(credentials);

    if (!createOutbox.success) {
      throw new InvalidCredentialsError(createOutbox.message, createOutbox.status);
    }

    const configData = getConfigData(sourceDetails);
    const connectors = await axios.get(destination);

    await validateSourceDetails(sourceDetails, connectors.data);

    const axiosResponse = await axios.post(destination, configData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (axiosResponse.status !== 201) {
      throw new Error('Failed to create new connector');
    }

    const newConnector = await postConfigDataToDB(configData);
    await createTopicsForKafka(sourceDetails.topics);

    res.status(201).send({
      message: 'Connector created',
      data: {...newConnector, date_created: formatDateForFrontend(newConnector.date_created)}
    });
  } catch (error) {
    console.error(`There was an error adding a new connector: ${error}`);
    next(error);
  }
});

router.delete('/:source_name', async (req, res, next) => {
  try {
    const sourceName = req.body.source_name;
    const inputPassword = req.body.database_password;
    const connector = await getConnectorWithSlotNameandPW(sourceName);
    
    if (!connector) {
      throw new ConnectorError("No Connector by that name exists");
    } else {
      const validPassword = await verifyPassword(inputPassword, connector.database_password);

      if (!validPassword) {
        throw new InvalidCredentialsError("Password does not match, please try again", 401);
      }

      const URL = `${destination}/${connector.name}`;
      await axios.delete(URL);
      await deleteConnectorByName(sourceName);
      const {slot_name, ...credentials} = connector;
      credentials.database_password = inputPassword;
      await deleteReplicationSlot(slot_name, credentials);
      res.status(201).send(`Connector '${connector.name}' deleted!`);
    }
  } catch (error) {
    next(error);
  }
});

export default router;