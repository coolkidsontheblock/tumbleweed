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
}


// [
//   { partition: 0, offset: '31004', high: '31004', low: '421' },
//   { partition: 1, offset: '54312', high: '54312', low: '3102' },
//   { partition: 2, offset: '32103', high: '32103', low: '518' },
//   { partition: 3, offset: '28', high: '28', low: '0' },
// ]