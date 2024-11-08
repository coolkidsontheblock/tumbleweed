import { ConsumerData } from "../types/consumerTypes";
import { PGSourceDetails } from "../types/sourceTypes";
import { ValidationError } from "../utils/errors";

const validateUniqueConnector = (connectors: string[], connector: string) => {
  if (connectors.find((c) => c === connector)) {
    throw new ValidationError(`Connector name "${connector}" already exists, please provide a unique name`);
  }
}

const validateEmptyString = (str: string) => {
  if (str.trim() === '') {
    throw new ValidationError('Value cannot contain only whitespace. Please provide a valid value.');
  }
}

export const validateSourceDetails = (sourceDetails: PGSourceDetails, connectors: string[]) => {
  const inputValues = Object.values(sourceDetails) as string[];
  console.log('inputValues: ', inputValues);
  console.log(connectors);
  inputValues.forEach(value => {
    validateEmptyString(String(value));
  });

  const connectorName = sourceDetails.name;
  validateUniqueConnector(connectors, connectorName);
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