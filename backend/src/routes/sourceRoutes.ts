import axios from 'axios';
import express from 'express';
import { getConfigData, postConfigDataToDB, getConnectorByName, deleteConnectorByName } from '../helpers/sourceHelper';
import { PGDetailsNoPW } from '../types/sourceTypes';

const router = express.Router();

// Get All Sources Route => String Array of Sources
router.get('/', async (req, res, next) => {
  try {
    const destination = 'http://localhost:8083/connectors';

    const { data } = await axios.get(destination);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(`${error}`)
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
      console.log("connector: ", connector)

      // the destination where we are getting the info is from kafka and not our database with the encrypted pw
      const destination = `http://localhost:8083/connectors/${connector.name}`;
      const { data } = await axios.get(destination);
      const basicConnectorInfo: PGDetailsNoPW = {
        name: data.name,
        plugin_name: data.config["plugin.name"],
        database_hostname: data.config["database.hostname"],
        database_port: data.config["database.port"],
        database_user: data.config["database.user"],
        database_dbname: data.config["database.dbname"],
        database_server_name: data.config["database.server.name"]
      }
      res.status(200).send({
        message: `Connector '${data.name}' Found.`,
        data: basicConnectorInfo,
      });
    }
  } catch (error) {
    res.status(404).send(`${error}`)
    console.error(`There was an error finding the connector: ${error}`);
    next(error);
  }
});

// POST a new source route => PGDetailsNoPW Object
// Add Validation!!! -> no empty strings allowed, strip whitespace, etc
router.post('/new_source', async (req, res, next) => {
  try {
    const sourceDetails = req.body;
    const destination = 'http://localhost:8083/connectors';

    const axiosResponse = await axios.post(destination, getConfigData(sourceDetails), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (axiosResponse.status !== 201) {
      throw new Error('Failed to create new connector');
    }

    const configData = getConfigData(sourceDetails);
    const newConnector = await postConfigDataToDB(configData);

    res.status(201).send({
      message: 'Connector created',
      data: newConnector,
    });
  } catch (error) {
    res.status(400).send(`${error}`)
    console.error(`There was an error adding a new connector: ${error}`);

    // Optionally: handle a rollback here if needed, e.g., delete any created connector in Debezium
    // Example:
    // if (axiosResponse && axiosResponse.data.name) {
    //   await axios.delete(`${destination}/${axiosResponse.data.name}`);
    // }

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
      throw new Error("No Connector by that name exists");
    } else {
      const destination = `http://localhost:8083/connectors/${connector.name}`;
      await axios.delete(destination);
      await deleteConnectorByName(sourceName);
      res.status(201).send(`Connector '${connector.name}' deleted!`);
    }
  } catch (error) {
    res.status(404).send(`${error}`)
    console.error(`There was an error deleting the connector: ${error}`);
    next(error);
  }
});

export default router;

