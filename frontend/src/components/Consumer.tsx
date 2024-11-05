import { ConsumerDetails } from "../types/types"

interface ConsumerProps {
  consumerDetails: ConsumerDetails | null
}

export const Consumer = ( { consumerDetails }: ConsumerProps) => {
  if (consumerDetails) {
    return (
      <div>
        <h2>Consumer Details</h2>
        <ul className="connectiondetails">
          <li>Consumer Name: {consumerDetails.name}</li>
          <li>Description: {consumerDetails.description}</li>
          <li>Endpoint URL: {consumerDetails.endpoint_URL}</li>
          <li>Kafka Client Id: {consumerDetails.kafka_client_id}</li>
          <li>Kafka Broker Endpoints: {consumerDetails.kafka_broker_endpoints}</li>
          <li>Kafka Group Id: {consumerDetails.kafka_group_id}</li>
          <li>Subscribed Topics: {consumerDetails.subscribed_topics}</li>
          <li>Received Message Count: {consumerDetails.received_message_count}</li>
          <li>Date Created: {consumerDetails.date_created}</li>
        </ul>
      </div>
    )
  }
}