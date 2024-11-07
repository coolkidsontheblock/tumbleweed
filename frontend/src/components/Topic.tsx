import { Dispatch, SetStateAction } from "react";
import { TopicData } from "../types/types";
import { Box, Modal } from "@mui/material";

interface TopicProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  topicData: TopicData | null
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

export const TopicInfo = ({ setOpen, open, topicData }: TopicProps) => {
  const handleCloseModal = () => {
    setOpen(false);
  };

  if (topicData) {
    return (
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h2>Topic Information</h2>
            <ul className="topicDetails">
              <li>Topic Name: {topicData.name}</li>
              <li>Message Count: {topicData.topic_message_count}</li>
              <li>Subscribed Consumers: {topicData.subscribed_consumers}</li>
              <li>Subscriber Count: {topicData.subscriber_count}</li>
            </ul>
          </div>
        </Box>
      </Modal>
    )
  }
}