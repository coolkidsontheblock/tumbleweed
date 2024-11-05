export interface ConsumerDetails {
  name: string,
  description: string,
  endpoint_URL: string,
  kafka_client_id: string,
  kafka_broker_endpoints: string,
  kafka_group_id: string,
  subscribed_topics: string,
  received_message_count: number,
  date_created: string
}

export type ConsumerName = Pick<ConsumerDetails, "name">;

