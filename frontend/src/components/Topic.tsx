import { Dispatch, SetStateAction } from "react";
import { TopicData } from "../types/types";
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


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
            <h3>Topic Information</h3>
            <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '4px 8px', fontSize: '0.875rem' } }}>
              <Table sx={{ minWidth: 650 }} aria-label="topic information table">
                <TableBody>
                  <TableRow>
                    <TableCell>Topic Name</TableCell>
                    <TableCell>{topicData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Message Count</TableCell>
                    <TableCell>{topicData.topic_message_count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subscribed Consumers</TableCell>
                    <TableCell>{topicData.subscribed_consumers}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subscriber Count</TableCell>
                    <TableCell>{topicData.subscriber_count}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Modal>
    )
  }
}