import axios from 'axios';
import express from 'express';
import { getConfigData } from '../helpers/sourceConnectorHelper';

const router = express.Router();

router.post('/new_source', async (req, res, next) => {
  try {
    const sourceDetails = req.body;
    const destination = 'http://localhost:8083/connectors';

    await axios.post(destination, getConfigData(sourceDetails), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(getConfigData(sourceDetails));
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