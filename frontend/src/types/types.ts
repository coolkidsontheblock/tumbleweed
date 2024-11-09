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
  plugin_name: string;
  date_created: string;
}

export interface ConsumerDetails {
  name: string;
  description: string;
  tumbleweed_endpoint: string;
  kafka_client_id: string;
  kafka_broker_endpoints: string[];
  kafka_group_id: string;
  subscribed_topics: string[];
  received_message_count: number;
  date_created: string;
}

export type ConsumerInputDetails = Omit<ConsumerDetails, 'received_message_count' | 'date_created' | 'kafka_broker_endpoints' | 'tumbleweed_endpoint'>;

export interface BooleanObject {
  [key: string]: boolean;
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

export interface TopicData {
  name: string,
  topic_message_count: number,
  subscribed_consumers: string[],
  subscriber_count: number,
  date_added: string
}

export interface TopicResponse {
  message: string,
  data: TopicData
}
