import { Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import { ConsumerDetails } from "../types/types"
import { Dispatch, SetStateAction } from "react";

interface ConsumerProps {
  setOpenConsumer: Dispatch<SetStateAction<boolean>>;
  openConsumer: boolean;
  handleDeleteConsumer: () => void;
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

export const Consumer = ({ setOpenConsumer, openConsumer, handleDeleteConsumer, selectedConsumer }: ConsumerProps) => {
  const handleCloseModal = () => {
    setOpenConsumer(false);
  };
  if (selectedConsumer) {
    console.log(selectedConsumer)
    return (
      <Modal open={openConsumer} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h2>Consumer Details</h2>
            <TableContainer component={Paper} sx={{ borderRadius: '15px', maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '8px 8px', fontSize: '0.875rem' } }}>
              <Table sx={{ width: '100%' }} aria-label="consumer information table">
                {/* <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>Value</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Consumer Name</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Tumbleweed Endpoint</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.tumbleweed_endpoint}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Kafka Client Id</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.kafka_client_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Kafka Broker Endpoints</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.kafka_broker_endpoints.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Kafka Group Id</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.kafka_group_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscribed Topics</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.subscribed_topics.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Received Message Count</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.received_message_count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Date Created</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{selectedConsumer.date_created}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
            <Button variant="contained"
              onClick={handleDeleteConsumer}
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 400,
                borderRadius: '30px',
                // border: '3px solid #331E14',
                backgroundColor: '#70AF85',
                '&:hover': {
                  backgroundColor: '#F58B33', // Change color on hover
                },
              }}>Delete Consumer</Button>
        </Box >
      </Modal >
    )
  }
}