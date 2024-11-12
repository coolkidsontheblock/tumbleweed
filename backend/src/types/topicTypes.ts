export interface TopicDetails {
  name: string,
  subscribed_consumers: string[],
  date_added: string
};

export type TopicName = Pick<TopicDetails, "name">;

export interface TopicOffsetByPartition {
  partition: number,
  offset: string,
  high: string,
  low: string
};