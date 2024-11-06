export interface SourceInput {
  name: string;
  database_hostname: string;
  database_port: number;
  database_user: string;
  database_password: string;
  database_dbname: string;
  database_server_name: string;
}

export type SourceData = Omit<SourceInput, 'database_password'> & {
  plugin_name: string
}

export interface ConsumerInputDetails {
  name: string,
  description: string,
  endpoint_URL: string,
  kafka_client_id: string,
  kafka_broker_endpoints: string,
  kafka_group_id: string,
  subscribed_topics: string,
}

export interface BooleanObject {
  [key: string]: boolean
}

export interface ErrorBannerProps {
  message: string;
  handleCloseSnackbar: () => void;
  openStatus: boolean;
}

export interface SuccessSnackProps {
  message: string;
  handleCloseSnackbar: () => void;
  openStatus: boolean;
}