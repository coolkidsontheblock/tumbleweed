import React, { useState } from "react";
import { createSource } from "../services/sourcesService";
import { SourceData, SourceInput } from "../types/types";
import { Button, Box, Modal, TextField } from "@mui/material";
import { validateInput, validatePort, validateListOfTopics, validateConnectorName, InputError } from "../utils/validation";
import { textFieldTheme } from '../styles/Theme';
import { ThemeProvider } from '@mui/material/styles';

interface SourceFormProps {
  setSources: React.Dispatch<React.SetStateAction<SourceData[]>>;
  setOpenSourceForm: React.Dispatch<React.SetStateAction<boolean>>;
  openSourceForm: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
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
  setSuccessMsg,
  setPage
}: SourceFormProps) => {
  const [dbhostname, setDBHostname] = useState<string>('');
  const [dbport, setDBPort] = useState<number>(0);
  const [dbname, setDBName] = useState<string>('');
  const [dbservername, setDBServerName] = useState<string>('');
  const [dbusername, setDBUsername] = useState<string>('');
  const [dbpassword, setDBPassword] = useState<string>('');
  const [connectorName, setConnectorName] = useState<string>('');
  const [topics, setTopics] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleNewSource = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};

    try {
      const sourceData: SourceInput = {
        name: validateConnectorName(connectorName),
        database_hostname: validateInput(dbhostname),
        database_port: validatePort(dbport),
        database_user: validateInput(dbusername),
        database_password: validateInput(dbpassword),
        database_dbname: validateInput(dbname),
        database_server_name: validateInput(dbservername),
        topics: validateListOfTopics(topics.split(', '))
      };

      setErrors({});
      const res = await createSource(sourceData);
      setSources((prevSources) => [res.data, ...prevSources]);
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
      setTopics('');
      setPage(0);
    } catch (error: any) {
      console.log(error);
      setError(true);
      const errorMessage = error instanceof InputError ? error.message : error.response?.data.message;
      const errorStatus = error.response?.status || "Invalid Input"; 

      setErrorMsg(`Error (${errorStatus}): ${errorMessage} `);

      if (!connectorName) newErrors.connectorName = true;
      if (!dbhostname) newErrors.dbhostname = true;
      if (!dbport) newErrors.dbport = true;
      if (!dbname) newErrors.dbname = true;
      if (!dbservername) newErrors.dbservername = true;
      if (!dbusername) newErrors.dbusername = true;
      if (!dbpassword) newErrors.dbpassword = true;
      if (!topics) newErrors.topics = true;

      setErrors(newErrors);
    }
  };

  const handleCloseModal = () => {
    setOpenSourceForm(false);
    setErrors({});
  };

  return (
    <ThemeProvider theme={textFieldTheme}>
      <Modal open={openSourceForm} onClose={handleCloseModal}>
        <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }} component="form">
          <h2 style={{ textAlign: 'center' }}>Connect a new source database</h2>
          <TextField
            required
            placeholder="Can only contain lowercase letters, digits, and underscores."
            id="connector-name"
            label="Connector Name"
            variant="outlined"
            error={errors.connectorName}
            helperText={errors.connectorName && "Connector Name is required"}
            onChange={(event) => setConnectorName(event.target.value)}
          />

          <TextField
            fullWidth
            required
            placeholder="Please enter your database hostname."
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
            placeholder="Please enter your database port. Must be between 0 and 65535."
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
            placeholder="Please enter your database name."
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
            placeholder="Please enter your database server name."
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
            placeholder="Please enter your database username."
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
            placeholder="Please enter your database password."
            id="dbpassword"
            label="Database Password"
            type="password"
            variant="outlined"
            error={errors.dbpassword}
            helperText={errors.dbpassword && "Database Password is required"}
            onChange={(event) => setDBPassword(event.target.value)}
          />

          <TextField
            fullWidth
            required
            id="topics"
            label="Topics"
            variant="outlined"
            placeholder="Please provide a comma separated list of topics, e.g., topic1, topic2, topic3"
            error={errors.topics}
            helperText={errors.topics && "Topics are required"}
            onChange={(event) => setTopics(event.target.value)}
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
                    backgroundColor: '#F58B33',
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
    </ThemeProvider>
  );
};
