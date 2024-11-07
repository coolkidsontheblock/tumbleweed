import shortUuid from 'short-uuid';

export const createUUID = () => {
  const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789_';
  return shortUuid(VALID_CHARS).generate();
};