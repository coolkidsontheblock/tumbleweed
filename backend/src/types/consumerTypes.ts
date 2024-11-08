export interface ConsumerDetails {
  name: string,
  description: string,
  tumbleweed_endpoint: string,
  kafka_client_id: string,
  kafka_broker_endpoints: string[],
  kafka_group_id: string,
  subscribed_topics: string[],
  received_message_count: number,
  date_created: string
}

export type ConsumerName = Pick<ConsumerDetails, "name">;

export type ConsumerTopicDetails = Pick<ConsumerDetails, "name" | "subscribed_topics">;

export interface ConsumerData {
  name: string;
  description: string;
  kafka_client_id: string;
  kafka_group_id: string;
  subscribed_topics: string[];
}