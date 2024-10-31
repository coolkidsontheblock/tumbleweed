import axios from 'axios';
import express from 'express';
import { getConfigData, postConfigDataToDB } from '../helpers/sourceConnectorHelper';

const router = express.Router();

// Get Sources Route => String Array of Sources
router.get('/', async (req, res, next) => {
  try {
    const destination = 'http://localhost:8083/connectors';

    const { data } = await axios.get(destination);
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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
    console.log(configData);

    postConfigDataToDB(configData);
    
    res.status(201).send('Connector created');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Think about how we can delete replication slot in db, give user a choice?
router.delete('/delete_source', async (req, res, next) => {
  const connectorName = req.query.connectorName;
  // console.log(req.query.connectorName)
  try {
    const destination = `http://localhost:8083/connectors/${connectorName}`;
    await axios.delete(destination);
    res.status(201).send('Connector deleted!');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;