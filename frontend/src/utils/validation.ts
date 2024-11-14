export class InputError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const MIN_PORT = 0;
const MAX_PORT = 65535;

export const validateInput = (input: string): string => {
  if (!input) {
    throw new InputError('Missing input. All fields are required. Please fill out all fields.');
  } else if (/\s/.test(input)) {
    throw new InputError('Input cannot contain whitespace. Please provide a valid input.');
  } else {
    return input;
  }
}

export const validateConnectorName = (name: string): string => {
  if (!name) {
    throw new InputError('Missing input. All fields are required. Please fill out all fields.');
  } else if (name.length > 64) {
    throw new InputError('Connector name must be less than 64 characters. Please provide a valid name.');
  } else if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name)) {
    throw new InputError('Connector name must only contain lowercase letters, digits, and underscores. Please provide a valid name.');
  } else if (name.startsWith('_') || name.endsWith('_')) {
    throw new InputError('Connector name cannot start or end with an underscore. Please provide a valid name.');
  } else {
    return name;
  }
}

export const validateListOfTopics = (input: string[]): string[] => {
  if (input.length === 0) {
    throw new InputError('Missing input. All fields are required. Please fill out all fields.');
  } else {
    return input;
  }
}

export const validatePort = (port: number): number => {
  if (port < MIN_PORT || port > MAX_PORT) {
    throw new InputError("Port number must be between 0 and 65535");
  } else if (isNaN(port)) {
    throw new InputError("Port must be a number. Please enter a valid number between 0 and 65535");
  } else if (!port) {
    throw new InputError("The port is required. Please enter a valid port number.");
  }
  else {
    return port;
  }
}
