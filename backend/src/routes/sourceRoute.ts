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

export default router;