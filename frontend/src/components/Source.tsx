import React, { Dispatch, SetStateAction } from "react";
import { SourceData } from "../types/types"
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button
} from '@mui/material';

interface SourceProps {
  setOpenSource: Dispatch<SetStateAction<boolean>>;
  openSource: boolean;
  handleDeleteSource: () => void;
  sourceData: SourceData | null;
  setSelectedSource: Dispatch<React.SetStateAction<SourceData | null>>;
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

export const Source = ({ setOpenSource, openSource, handleDeleteSource, sourceData, setSelectedSource }: SourceProps) => {
  const handleCloseModal = () => {
    setSelectedSource(null);
    setOpenSource(false);
  };

  if (sourceData) {
    return (
      <Modal open={openSource} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h2>Source Information</h2>
            <TableContainer component={Paper} sx={{ borderRadius: '15px', maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '8px 8px', fontSize: '0.875rem' } }}>
              <Table sx={{ minWidth: 650 }} aria-label="source information table">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Connector Name</TableCell>
                    <TableCell>{sourceData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Database Hostname</TableCell>
                    <TableCell>{sourceData.database_hostname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Database Port</TableCell>
                    <TableCell>{sourceData.database_port}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Database Name</TableCell>
                    <TableCell>{sourceData.database_dbname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Database Server Name</TableCell>
                    <TableCell>{sourceData.database_server_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Database Username</TableCell>
                    <TableCell>{sourceData.database_user}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Slot Name</TableCell>
                    <TableCell>{sourceData.slot_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date Created</TableCell>
                    <TableCell>{sourceData.date_created}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Button variant="contained" 
            onClick={handleDeleteSource}
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 400,
              borderRadius: '30px',
              backgroundColor: '#70AF85',
              '&:hover': {
                backgroundColor: '#F58B33',
              },
            }}>Delete Source</Button>
        </Box>
      </Modal>
    )
  }
}
