import { Dispatch, SetStateAction } from "react";
import { SourceData } from "../types/types"
// import { Box, Modal } from "@mui/material";
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
  sourceData: SourceData | null
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


export const Source = ({ setOpenSource, openSource, handleDeleteSource, sourceData }: SourceProps) => {
  const handleCloseModal = () => {
    setOpenSource(false);
  };

  if (sourceData) {
    return (
      <Modal open={openSource} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
          <div>
            <h2>Source Information</h2>
            <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: '0 auto', '& .MuiTableCell-root': { padding: '4px 8px', fontSize: '0.875rem' } }}>
              <Table sx={{ minWidth: 650 }} aria-label="source information table">
                {/* <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>Value</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Connector Name</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{sourceData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Database Hostname</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{sourceData.database_hostname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Database Port</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{sourceData.database_port}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Database Name</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{sourceData.database_dbname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Database Server Name</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{sourceData.database_server_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Database Username</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400 }}>{sourceData.database_user}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Button variant="contained" className="connectionButton" 
            onClick={handleDeleteSource}
            style={{
              fontFamily: "Montserrat", 
              fontWeight: 400
              // padding: '4px 4px 4px 4px',
              // fontSize: '0.7rem',
              // width: '100%',
              // maxWidth: '685px', 
              // border: '2px solid #331E14', 
              // color: '#331E14',
              // borderRadius: '10px',
            }}>Delete Source</Button>
        </Box>
      </Modal>
      // <Modal open={openSource} onClose={handleCloseModal}>
      //   <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }}>
      //     <div>
      //       <h2>Source Information</h2>
      //       <ul className="connectiondetails">
      //         <li>Connector Name: {sourceData.name}</li>
      //         <li>Database Hostname: {sourceData.database_hostname}</li>
      //         <li>Database Port: {sourceData.database_port}</li>
      //         <li>Database Name: {sourceData.database_dbname}</li>
      //         <li>Database Server Name: {sourceData.database_server_name}</li>
      //         <li>Database Username: {sourceData.database_user}</li>
      //       </ul>
      //     </div>
      //   </Box>
      // </Modal>
    )
  }
}