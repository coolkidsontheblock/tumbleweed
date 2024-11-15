import { useEffect, useState } from "react";
import { SourceData } from "../types/types";
import { Button, Box, Modal, TextField } from "@mui/material";
import { InputError, validateInput } from "../utils/validation";
import { textFieldTheme } from '../styles/Theme';
import { ThemeProvider } from '@mui/material/styles';
import { deleteSource } from "../services/sourcesService";

interface DeleteSourceFormProps {
  setOpenDeleteForm: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteForm: boolean;
  setOpenSource: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSource: SourceData | null;
  setSelectedSource: React.Dispatch<SourceData | null>;
  setSources: React.Dispatch<React.SetStateAction<SourceData[]>>
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
  width: 454,
  bgcolor: 'background.paper',
  boxShadow: '24px',
  p: 4,
  borderRadius: '15px',
};

export const DeleteSourceForm = ({
  setError,
  setErrorMsg,
  setSuccess,
  setSuccessMsg,
  setOpenDeleteForm,
  openDeleteForm,
  setOpenSource,
  selectedSource,
  setSelectedSource,
  setSources
}: DeleteSourceFormProps) => {
  const [dbpassword, setDBPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    setOpenSource(false);
    setOpenDeleteForm(true);
  }, []);

  const handleConfirmDelete = async () => {
    const newErrors: { [key: string]: boolean } = {};

    try {
      if (selectedSource) {
        const sourceCredentials = {
          source_name: selectedSource.name,
          database_password: validateInput(dbpassword)
        };

        setErrors({});
        await deleteSource(sourceCredentials);
        setSources(prevSources => prevSources.filter(sourceString => sourceString.name !== selectedSource.name));
        setSelectedSource(null);
        setSuccess(true);
        setSuccessMsg("Source deleted successfully!");
        setDBPassword('');
        setOpenDeleteForm(false);
      }
    } catch (error: any) {
      setError(true);
      const errorMessage = error instanceof InputError ? error.message : error.response?.data.message;
      const errorStatus = error.response?.status || "Invalid Input"; 
      setErrorMsg(`Error (${errorStatus}): ${errorMessage} `);
      if (!dbpassword) newErrors.dbpassword = true;
      setErrors(newErrors);
    }
  }

  const handleCloseModal = () => {
    setOpenDeleteForm(false);
  };

  return (
    <ThemeProvider theme={textFieldTheme}>
    <Modal open={openDeleteForm} onClose={handleCloseModal}>
      <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }} component="form">
        <h2 style={{ textAlign: 'center' }}>Confirm Database password to delete</h2>
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
        <Box>
        <Button variant="contained" 
            onClick={handleConfirmDelete} 
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
            Delete
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
