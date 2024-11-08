import { Box, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
    return (
      <Modal open={openConsumer} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h3>Consumer Details</h3>
            <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '4px 8px', fontSize: '0.875rem' } }}>
              <Table sx={{ width: '100%' }} aria-label="consumer information table">
                {/* <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>Value</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  <TableRow>
                    <TableCell>Consumer Name</TableCell>
                    <TableCell>{selectedConsumer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{selectedConsumer.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Endpoint URL</TableCell>
                    <TableCell>{selectedConsumer.endpoint_url}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kafka Client Id</TableCell>
                    <TableCell>{selectedConsumer.kafka_client_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kafka Broker Endpoints</TableCell>
                    <TableCell>{selectedConsumer.kafka_broker_endpoints}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kafka Group Id</TableCell>
                    <TableCell>{selectedConsumer.kafka_group_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subscribed Topics</TableCell>
                    <TableCell>{selectedConsumer.subscribed_topics}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Received Message Count</TableCell>
                    <TableCell>{selectedConsumer.received_message_count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date Created</TableCell>
                    <TableCell>{selectedConsumer.date_created}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <button className="connectionButton" onClick={handleDeleteConsumer}>Delete Consumer</button>
        </Box >
      </Modal >
    )
  }
}