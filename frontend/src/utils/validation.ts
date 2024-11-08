export class InputError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const validateInput = (input: string): string => {
  if (!input) {
    throw new InputError('Missing input. All fields are required. Please fill out all fields.');
  } else if (/\s/.test(input)) {
    throw new InputError('Input cannot contain whitespace. Please provide a valid input.');
  } else {
    return input;
  }
}

export const validatePort = (port: number): number => {
  if (port < 0 || port > 65535) {
    throw new InputError("Port number must be between 0 and 65535");
  } else if (isNaN(port)) {
    throw new InputError("Port must be a number. Please enter a valid number between 0 and 65535");
  }
  else {
    return port;
  }
}