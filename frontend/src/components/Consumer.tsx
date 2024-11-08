import { Box, Modal } from "@mui/material";
import { ConsumerDetails } from "../types/types"
import { Dispatch, SetStateAction } from "react";

interface ConsumerProps {
  setOpenConsumer: Dispatch<SetStateAction<boolean>>;
  openConsumer: boolean;
  selectedConsumer: ConsumerDetails | null
}

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: "column",
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: '24px',
  p: 4,
  borderRadius: '15px',
};

export const Consumer = ({ setOpenConsumer, openConsumer, selectedConsumer }: ConsumerProps) => {
  const handleCloseModal = () => {
    setOpenConsumer(false);
  };

  if (selectedConsumer) {
    return (
      <Modal open={openConsumer} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h2>Consumer Details</h2>
            <ul className="connection-details">
              <li>Consumer Name: {selectedConsumer.name}</li>
              <li>Description: {selectedConsumer.description}</li>
              <li>Endpoint URL: {selectedConsumer.endpoint_url}</li>
              <li>Kafka Client Id: {selectedConsumer.kafka_client_id}</li>
              <li>Kafka Broker Endpoints: {selectedConsumer.kafka_broker_endpoints}</li>
              <li>Kafka Group Id: {selectedConsumer.kafka_group_id}</li>
              <li>Subscribed Topics: {selectedConsumer.subscribed_topics}</li>
              <li>Received Message Count: {selectedConsumer.received_message_count}</li>
              <li>Date Created: {selectedConsumer.date_created}</li>
            </ul>
          </div>
        </Box>
      </Modal>
    )
  }
}