import { ConsumerDetails } from "../types/types"

interface ConsumerProps {
  selectedConsumer: ConsumerDetails | null
}

export const Consumer = ( { selectedConsumer }: ConsumerProps) => {
  if (selectedConsumer) {
    return (
      <div>
        <h2>Consumer Details</h2>
        <ul className="connection-details">
          <li>Consumer Name: {selectedConsumer.name}</li>
          <li>Description: {selectedConsumer.description}</li>
          <li>Endpoint URL: {selectedConsumer.endpoint_URL}</li>
          <li>Kafka Client Id: {selectedConsumer.kafka_client_id}</li>
          <li>Kafka Broker Endpoints: {selectedConsumer.kafka_broker_endpoints}</li>
          <li>Kafka Group Id: {selectedConsumer.kafka_group_id}</li>
          <li>Subscribed Topics: {selectedConsumer.subscribed_topics}</li>
          <li>Received Message Count: {selectedConsumer.received_message_count}</li>
          <li>Date Created: {selectedConsumer.date_created}</li>
        </ul>
      </div>
    )
  }
}