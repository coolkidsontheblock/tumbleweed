export interface Source {
  'database.hostname': string;
  'database.port': number;
  'database.user': string;
  'database.password': string;
  'database.dbname': string;
  'database.server.name': string;
}

export interface ButtonProps {
  btnName: string;
  clickHandler: () => void;
}