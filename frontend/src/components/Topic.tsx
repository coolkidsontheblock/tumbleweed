import { Dispatch, SetStateAction } from "react";
import { TopicData } from "../types/types";
import { Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button
} from '@mui/material';

interface TopicProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  selectedTopic: TopicData | null;
  setSelectedTopic: Dispatch<SetStateAction<TopicData | null >>;
  handleDeleteTopic: () => void;
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

export const Topic = ({ setOpen, open, selectedTopic, setSelectedTopic, handleDeleteTopic }: TopicProps) => {
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTopic(null);
  };

  if (selectedTopic) {
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
                    <TableCell sx={{ fontWeight: 700 }}>Topic Name</TableCell>
                    <TableCell >{selectedTopic.topic}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Message Count</TableCell>
                    <TableCell >{selectedTopic.message_count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Subscribed Consumers</TableCell>
                    <TableCell >{selectedTopic.subscribed_consumers.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Subscriber Count</TableCell>
                    <TableCell >{selectedTopic.subscribed_consumers.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{fontWeight: 700 }}>Date Added</TableCell>
                    <TableCell >{selectedTopic.date_added}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Button variant="contained"
              onClick={handleDeleteTopic}
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 400,
                borderRadius: '30px',
                backgroundColor: '#70AF85',
                '&:hover': {
                  backgroundColor: '#F58B33',
                },
              }}
          >
            Delete Topic
          </Button>
        </Box>
      </Modal>
    )
  }
}
