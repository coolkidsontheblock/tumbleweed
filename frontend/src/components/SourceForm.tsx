import React, { useState } from "react";
import { createSource } from "../services/sourcesService";
import { SourceInput } from "../types/types";
import { Button, Box, Modal, TextField } from "@mui/material";
import { validateInput, validatePort } from "../utils/validation";

interface SourceFormProps {
  setSources: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenSourceForm: React.Dispatch<React.SetStateAction<boolean>>;
  openSourceForm: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
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



export const SourceForm = ({
  setSources,
  setOpenSourceForm,
  openSourceForm,
  setError,
  setErrorMsg,
  setSuccess,
  setSuccessMsg
}: SourceFormProps) => {
  const [dbhostname, setDBHostname] = useState<string>('');
  const [dbport, setDBPort] = useState<number>(0);
  const [dbname, setDBName] = useState<string>('');
  const [dbservername, setDBServerName] = useState<string>('');
  const [dbusername, setDBUsername] = useState<string>('');
  const [dbpassword, setDBPassword] = useState<string>('');
  const [connectorName, setConnectorName] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleNewSource = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};

    try {
      const sourceData: SourceInput = {
        name: validateInput(connectorName),
        database_hostname: validateInput(dbhostname),
        database_port: validatePort(dbport),
        database_user: validateInput(dbusername),
        database_password: validateInput(dbpassword),
        database_dbname: validateInput(dbname),
        database_server_name: validateInput(dbservername),
      };

      setErrors({});
      const res = await createSource(sourceData);
      setSources((prevSources) => prevSources.concat(res.data.name));

      setSuccess(true);
      setSuccessMsg("Source created successfully!");
      setOpenSourceForm(false);
      setDBHostname('');
      setDBPort(0);
      setDBName('');
      setDBServerName('');
      setDBUsername('');
      setDBPassword('');
      setConnectorName('');
    } catch (error: any) {
      setError(true);
      const errorMessage = error.response.data.message;
      const errorStatus = error.response.status;

      setErrorMsg(`Error (${errorStatus}): ${errorMessage} `);

      if (!connectorName) newErrors.connectorName = true;
      if (!dbhostname) newErrors.dbhostname = true;
      if (!dbport) newErrors.dbport = true;
      if (!dbname) newErrors.dbname = true;
      if (!dbservername) newErrors.dbservername = true;
      if (!dbusername) newErrors.dbusername = true;
      if (!dbpassword) newErrors.dbpassword = true;

      setErrors(newErrors);
    }
  };

  const handleCloseModal = () => {
    setOpenSourceForm(false);
    setErrors({});
  };

  return (
    <Modal open={openSourceForm} onClose={handleCloseModal}>
      <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }} component="form">
        <h2 style={{ textAlign: 'center' }}>Connect a new source DB to Tumbleweed</h2>
        <p style={{ textAlign: 'center' }}>Please enter your database connection details below:</p>

        <TextField
          required
          id="connector-name"
          label="Connector Name"
          variant="outlined"
          error={errors.connectorName}
          helperText={errors.connectorName && "Connector Name is required"}
          onChange={(event) => setConnectorName(event.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
            // Change label font and color
            '& .MuiInputLabel-root': {
              fontFamily: "Montserrat",
              fontWeight: 400,
              color: '#331E14',
            },
            // Change input text font and color
            '& .MuiInputBase-input': {
              fontFamily: "Montserrat",
              fontWeight: 400,
              color: '#331E14',
            },
            // Change the border color of the outline when focused
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#F58B33', // Outline color when focused
            },
          }}
        />

        <TextField
          fullWidth
          required
          id="dbhostname"
          label="Database Hostname"
          variant="outlined"
          error={errors.dbhostname}
          helperText={errors.dbhostname && "Database Hostname is required"}
          onChange={(event) => setDBHostname(event.target.value)}
        />

        <TextField
          fullWidth
          required
          id="dbport"
          label="Database Port"
          variant="outlined"
          error={errors.dbport}
          helperText={errors.dbport && "Database Port is required"}
          onChange={(event) => setDBPort(Number(event.target.value))}
        />

        <TextField
          fullWidth
          required
          id="dbname"
          label="Database Name"
          variant="outlined"
          error={errors.dbname}
          helperText={errors.dbname && "Database Name is required"}
          onChange={(event) => setDBName(event.target.value)}
        />

        <TextField
          fullWidth
          required
          id="dbservername"
          label="Database Server Name"
          variant="outlined"
          error={errors.dbservername}
          helperText={errors.dbservername && "Database Server Name is required"}
          onChange={(event) => setDBServerName(event.target.value)}
        />

        <TextField
          fullWidth
          required
          id="dbusername"
          label="Database Username"
          variant="outlined"
          error={errors.dbusername}
          helperText={errors.dbusername && "Database Username is required"}
          onChange={(event) => setDBUsername(event.target.value)}
        />

        <TextField
          fullWidth
          required
          id="dbpassword"
          label="Database Password"
          type="password"
          variant="outlined"
          error={errors.dbpassword}
          helperText={errors.dbpassword && "Database Password is required"}
          onChange={(event) => setDBPassword(event.target.value)}
        />

        <Box>
          <Button variant="contained" 
            onClick={handleNewSource} 
            sx={{ 
              marginRight: '10px',
              fontFamily: "Montserrat",
              fontWeight: 400,
              borderRadius: '30px',
              backgroundColor: '#70AF85',
              '&:hover': {
                  backgroundColor: '#F58B33', // Change color on hover
              }, 
              }}>
            Connect
          </Button>
          <Button variant="outlined" 
            onClick={handleCloseModal}
            sx={{ 
              fontFamily: "Montserrat",
              fontWeight: 400,
              borderRadius: '30px',
              border: '1px solid #70AF85',
              color: '#70AF85',
              '&:hover': {
                border: '1px solid #F58B33',
                color: '#F58B33'
              }, 
              }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
