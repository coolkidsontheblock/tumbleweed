import shortUuid from 'short-uuid';

export const createUUID = () => {
  const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789_';
  return shortUuid(VALID_CHARS).generate();
};

export const createKafkaClientId = (kafkaGroupId: string) => {
  const shortUUID = createUUID().slice(0, 13);
  return `${kafkaGroupId}-${shortUUID}`;
};