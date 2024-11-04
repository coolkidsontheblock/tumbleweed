import axios from 'axios';
import express from 'express';
import { getAllConsumers, postConsumerToDB } from '../helpers/consumerConnectorHelper';
import { PGDetailsNoPW } from '../types/connectorTypes';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {

    const data = await getAllConsumers();
    console.log(data)
    // const destination = 'http://localhost:8083/connectors';

    // const { data } = await axios.get(destination);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(`${error}`)
    console.error(error);
    next(error);
  }
});

// Get Info for Single Sources Route => PGDetailsNoPW Object
// router.get('/:consumer_id', async (req, res, next) => {
//   try {
//     const sourceName = req.params.source_name;
//     const connector = await getConnectorByName(sourceName);

//     if (!connector) {
//       throw new Error("No Connector by that name exists");
//     } else {
//       console.log("connector: ", connector)

//       // the destination where we are getting the info is from kafka and not our database with the encrypted pw
//       const destination = `http://localhost:8083/connectors/${connector.name}`;
//       const { data } = await axios.get(destination);
//       const basicConnectorInfo: PGDetailsNoPW = {
//         name: data.name,
//         plugin_name: data.config["plugin.name"],
//         database_hostname: data.config["database.hostname"],
//         database_port: data.config["database.port"],
//         database_user: data.config["database.user"],
//         database_dbname: data.config["database.dbname"],
//         database_server_name: data.config["database.server.name"]
//       }
//       res.status(200).send({
//         message: `Connector '${data.name}' Found.`,
//         data: basicConnectorInfo,
//       });
//     }
//   } catch (error) {
//     res.status(404).send(`${error}`)
//     console.error(`There was an error finding the connector: ${error}`);
//     next(error);
//   }
// });

// POST a new source route => PGDetailsNoPW Object
// Add Validation!!! -> no empty strings allowed, strip whitespace, etc
router.post('/new_consumer', async (req, res, next) => {
  try {
    const consumerData = req.body;
    // const destination = 'http://localhost:8083/connectors';

    // const axiosResponse = await axios.post(destination, getConfigData(sourceDetails), {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    console.log(consumerData)
    // const configData = getConfigData(sourceDetails);
    const newConsumer = await postConsumerToDB(consumerData);

    res.status(201).send({
      message: 'Consumer created',
      data: newConsumer,
    });
  } catch (error) {
    res.status(400).send(`${error}`)
    console.error(`There was an error adding a new consumer: ${error}`);

    // Optionally: handle a rollback here if needed, e.g., delete any created connector in Debezium
    // Example:
    // if (axiosResponse && axiosResponse.data.name) {
    //   await axios.delete(`${destination}/${axiosResponse.data.name}`);
    // }

    next(error);
  }
});

export default router;