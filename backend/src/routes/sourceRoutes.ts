import axios from 'axios';
import express from 'express';
import { getConfigData, postConfigDataToDB, getConnectorByName, deleteConnectorByName } from '../helpers/sourceHelper';
import { formatDateForFrontend } from '../helpers/consumerHelper';
import { PGDetailsNoPW, PGCredentials } from '../types/sourceTypes';
import { validateSourceDetails, validateDBCredentials } from '../helpers/validation';
import { ConnectorError, InvalidCredentialsError } from '../utils/errors';

const router = express.Router();

const destination = process.env.NODE_ENV === 'production'
      ? 'http://connect:8083/connectors' 
      : 'http://localhost:8083/connectors';

// Get All Sources Route => String Array of Sources
router.get('/', async (req, res, next) => {
  try {     
    const { data } = await axios.get(destination);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Get Info for Single Sources Route => PGDetailsNoPW Object
router.get('/:source_name', async (req, res, next) => {
  try {
    const sourceName = req.params.source_name;
    const connector = await getConnectorByName(sourceName);

    if (!connector) {
      throw new Error("No Connector by that name exists");
    } else {
      // the destination where we are getting the info is from kafka and not our database with the encrypted pw
      const URL = `${destination}/${connector.name}`;
      const { data } = await axios.get(URL);
      const basicConnectorInfo: PGDetailsNoPW = {
        name: data.name,
        plugin_name: data.config["plugin.name"],
        database_hostname: data.config["database.hostname"],
        database_port: data.config["database.port"],
        database_user: data.config["database.user"],
        database_dbname: data.config["database.dbname"],
        database_server_name: data.config["database.server.name"],
        date_created: formatDateForFrontend(connector.date_created),
      }
      res.status(200).send({
        message: `Connector '${data.name}' Found.`,
        data: basicConnectorInfo,
      });
    }
  } catch (error) {
    console.error(`There was an error finding the connector: ${error}`);
    next(error);
  }
});

// POST a new source route => PGDetailsNoPW Object
// Add Validation!!! -> no empty strings allowed, strip whitespace, etc
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

    const configData = getConfigData(sourceDetails);
    const connectors = await axios.get(destination);

    validateSourceDetails(sourceDetails, connectors.data);

    const axiosResponse = await axios.post(destination, configData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (axiosResponse.status !== 201) {
      throw new Error('Failed to create new connector');
    }

    const newConnector = await postConfigDataToDB(configData);

    res.status(201).send({
      message: 'Connector created',
      data: newConnector,
    });
  } catch (error) {
    console.error(`There was an error adding a new connector: ${error}`);
    next(error);
  }
});

// Think about how we can delete replication slot in db, give user a choice?

// DELETE a source route => VOID
router.delete('/:source_name', async (req, res, next) => {
  try {
    const sourceName = req.params.source_name;
    const connector = await getConnectorByName(sourceName);

    if (!connector) {
      throw new ConnectorError("No Connector by that name exists");
    } else {
      const URL = `${destination}/${connector.name}`;
      await axios.delete(URL);
      await deleteConnectorByName(sourceName);
      res.status(201).send(`Connector '${connector.name}' deleted!`);
    }
  } catch (error) {
    next(error);
  }
});

export default router;

