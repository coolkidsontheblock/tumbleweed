export class ValidationError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class InvalidCredentialsError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class DatabaseError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}

export class ConnectorError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class HttpError extends Error {
  public status: number;
  constructor(message: string, number: number) {
    super(message);
    this.status = number;
  }
}