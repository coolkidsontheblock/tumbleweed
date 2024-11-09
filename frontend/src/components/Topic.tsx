import { Dispatch, SetStateAction } from "react";
import { TopicData } from "../types/types";
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';


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
            <TableContainer component={Paper} sx={{ borderRadius: '15px', maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '8px 8px', fontSize: '0.875rem' } }}>
              <Table sx={{ minWidth: 650 }} aria-label="topic information table">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Topic Name</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Message Count</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicData.topic_message_count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscribed Consumers</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicData.subscribed_consumers.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscriber Count</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicData.subscriber_count}</TableCell>
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