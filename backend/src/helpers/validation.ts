import { ConsumerData } from "../types/consumerTypes";
import { PGSourceDetails, PGCredentials} from "../types/sourceTypes";
import { ValidationError } from "../utils/errors";
import { Client } from "pg";
import { query } from "../database/pg";

const validateUniqueConnector = (connectors: string[], connector: string) => {
  if (connectors.find((c) => c === connector)) {
    throw new ValidationError(`Connector name "${connector}" already exists, please provide a unique name.`);
  }
}

const validateUniqueSourceHostName = async (hostname: string) => {
  const queryResult = await query('SELECT database_hostname FROM connectors WHERE database_hostname = $1', [hostname]);
  const hostnameExists = queryResult.rows.length > 0;
  if (hostnameExists) {
    throw new ValidationError(`A connector for hostname "${hostname}" already exists. Only one connector per database is necessary.`);
  }
}

const validateEmptyString = (str: string) => {
  if (str.trim() === '') {
    throw new ValidationError('Input field cannot be empty. Please provide a valid value.');
  }
}

export const validateSourceDetails = async (sourceDetails: PGSourceDetails, connectors: string[]) => {
  const inputValues = Object.values(sourceDetails) as string[];

  inputValues.forEach(value => {
    validateEmptyString(String(value));
  });

  const connectorName = sourceDetails.name;
  validateUniqueConnector(connectors, connectorName);
  await validateUniqueSourceHostName(sourceDetails.database_hostname);
}

export const validateConsumerData = (data: ConsumerData) => {
  if (
    data.name.trim() === '' ||
    data.kafka_group_id.trim() === '' ||
    data.subscribed_topics.length === 0 
  ) {
    throw new ValidationError('A name, kafka group ID, and at least one topic are required.');
  }
};

export const validateDBCredentials = async (credentials: PGCredentials) => {
  const client = new Client({
    user: credentials.database_user,
    password: credentials.database_password,
    host: credentials.database_hostname,
    port: credentials.database_port,
    database: credentials.database_dbname,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log('Connection successful');
    return { success: true, message: 'Credentials verified successfully', status: 200};
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return { 
        success: false,
        message: 'Connection refused. Check the hostname and port.',
        status: 502
      };
    } else if (error.code === 'EHOSTUNREACH' || error.code === 'ENOTFOUND') {
        return {
          success: false,
          message: 'Host unreachable. Verify the hostname is correct.',
          status: 503
        };
    } else if (error.code === '28P01') {
        return {
          success: false,
          message: 'Invalid username or password.',
          status: 401
        };
    } else if (error.message.includes('timeout')) {
        return {
          success: false,
          message: 'Connection timed out. Check the network settings and port.',
          status: 408
        };
    } else {
        return {
          success: false,
          message: 'An unknown error occurred. Please verify all inputs.',
          status: 500
        };
    }
  } finally {
    await client.end();
  }
}