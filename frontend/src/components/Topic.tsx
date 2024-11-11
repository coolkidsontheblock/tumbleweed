import { Dispatch, SetStateAction } from "react";
import { TopicsData, TopicResponse } from "../types/types";
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

interface TopicProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  topicInfo: TopicsData | null;
  setSelectedTopic: Dispatch<SetStateAction<TopicsData | null >>;
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

export const TopicInfo = ({ setOpen, open, topicInfo, setSelectedTopic }: TopicProps) => {
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTopic(null);
  };

  if (topicInfo) {
    return (
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h2>Topic Information</h2>
            <TableContainer 
              component={Paper}
              sx={{
                borderRadius: '15px',
                maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '8px 8px', fontSize: '0.875rem' }
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="topic information table">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Topic Name</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicInfo.topic}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Message Count</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicInfo.message_count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscribed Consumers</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicInfo.subscribed_consumers.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscriber Count</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicInfo.subscribed_consumers.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Date Added</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{topicInfo.date_added}</TableCell>
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