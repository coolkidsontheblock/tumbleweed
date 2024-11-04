import axios from 'axios';
import express from 'express';
import { getConfigData, postConfigDataToDB, getConnectorBySourceID, deleteConnectorBySourceID } from '../helpers/sourceConnectorHelper';
import { PGDetailsNoPW } from '../types/connectorTypes';

const router = express.Router();

// Get All Sources Route => String Array of Sources
router.get('/', async (req, res, next) => {
  try {
    const destination = 'http://localhost:8083/connectors';

    const { data } = await axios.get(destination);
    // console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Get Info for Single Sources Route => PGDetailsNoPW Object
router.get('/:source_id', async (req, res, next) => {
  try {
    const id = req.params.source_id;
    const connector = await getConnectorBySourceID(id);

    if (!connector) {
      throw new Error("No Connector by that ID exists");
    } else {
      console.log("connector: ", connector)

      // the destination where we are getting the info is from kafka and not our database with the encrypted pw
      const destination = `http://localhost:8083/connectors/${connector.name}`;
      const { data } = await axios.get(destination);
      const basicConnectorInfo: PGDetailsNoPW = {
        source_id: id,
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
    console.error(`There was an error finding the connector: ${error}`);
    next(error);
  }
});

// POST a new source route => PGDetailsNoPW Object
router.post('/new_source', async (req, res, next) => {
  try {
    const sourceDetails = req.body;
    const destination = 'http://localhost:8083/connectors';

    await axios.post(destination, getConfigData(sourceDetails), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const configData = getConfigData(sourceDetails);
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
router.delete('/:source_id/delete', async (req, res, next) => {
  try {
    const id = req.params.source_id;
    const connector = await getConnectorBySourceID(id);

    if (!connector) {
      throw new Error("No Connector by that ID exists");
    } else {
      console.log("connector: ", connector)
      const destination = `http://localhost:8083/connectors/${connector.name}`;
      await axios.delete(destination);
      await deleteConnectorBySourceID(id);
      res.status(201).send(`Connector '${connector.name}' deleted!`);
    }
  } catch (error) {
    console.error(`There was an error deleting the connector: ${error}`);
    next(error);
  }
});

export default router;


// Make some of these things transactions!