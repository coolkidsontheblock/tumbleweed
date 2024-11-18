import { SourceData } from '../types/types';
import { SourceForm } from "./SourceForm";
import { getSources } from "../services/sourcesService";
import { DeleteSourceForm } from './DeleteSourceForm';
import { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { sortSourcesByDate} from "../utils/sorting";
import { SuccessSnack } from "./SuccessSnack";
import { Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  TableHead,
  Button
} from '@mui/material';
import { ZodError } from 'zod';

interface SourcesProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sources = ({ setLoading }: SourcesProps) => {
  const [sources, setSources] = useState<SourceData[]>([]);
  const [selectedSource, setSelectedSource] = useState<SourceData | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [openSourceForm, setOpenSourceForm] = useState<boolean>(false);
  const [openSource, setOpenSource] = useState<boolean>(false);
  const [openDeleteForm, setOpenDeleteForm] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const request = await getSources();
        const data = sortSourcesByDate(request.data);
        setSources(data);
      } catch (error) {
        console.error(error);
        setError(true);
        if (error instanceof ZodError) {
          setErrorMsg('There was an error fetching the data. Please try again later.');
        } else {
          setErrorMsg("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSources();
  }, [])

  const handleDeleteSource = async () => {
    setOpenSourceForm(false);
    setOpenDeleteForm(true);
  }

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentSources = sources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCloseSnackbar = () => {
    setError(false);
    setErrorMsg('');
    setSuccess(false);
    setSuccessMsg('');
  }

  return (
    <>
      <div className="connectionlist">
        {error && (
          <ErrorSnack
            message={errorMsg}
            handleCloseSnackbar={handleCloseSnackbar}
            openStatus={error}
          />
        )}
        {success && (
          <SuccessSnack
            message={successMsg}
            handleCloseSnackbar={handleCloseSnackbar}
            openStatus={success}
          />
        )}
        <div id="sourcelist">
          <h1>Source List</h1>
          {sources.length > 0 && (
          <>
            <TableContainer
                component={Paper}
                sx={{
                  borderRadius: '15px',
                  maxWidth: '100%', overflowX: 'auto',
                  marginLeft: "50px", marginRight: "50px",
                  boxSizing: 'border-box'
                }}
              >
              <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small" aria-label="source list table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date Added</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ marginRight: '100px' }}>
                  {currentSources.map(source => (
                    <TableRow key={source.name}>
                      <TableCell>
                        <Link
                          className="link"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedSource(source);
                            setOpenSource(true);
                          } }
                          to={''}
                        >
                          {source.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {source.date_created}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" alignItems="center" justifyContent="right" sx={{ mr: 9.5, marginLeft: "50px" }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sources.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '& .MuiTablePagination-toolbar': { minHeight: '36px' },
                  '& .MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows': {
                    fontSize: '0.75rem', fontFamily: "Montserrat", fontWeight: 400
                  },
                }}
              />
            </Box>
          </>
        )}
          <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                className="connectionButton"
                onClick={() => setOpenSourceForm(true)}
                sx={{
                  marginLeft: '50px',
                  fontFamily: "Montserrat",
                  fontWeight: 400,
                  borderRadius: '30px',
                  backgroundColor: '#70AF85',
                  '&:hover': {
                    backgroundColor: '#F58B33'
                  },
              }}
              >
                Create New Source
              </Button>
            </Box>
        </div>
        {selectedSource && openSource &&
          <>
            <Source
              setOpenSource={setOpenSource}
              openSource={openSource}
              handleDeleteSource={handleDeleteSource}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
          </>}
        {openSourceForm &&
          <SourceForm
            setSources={setSources}
            setOpenSourceForm={setOpenSourceForm}
            openSourceForm={openSourceForm}
            setError={setError}
            setErrorMsg={setErrorMsg}
            setSuccess={setSuccess}
            setSuccessMsg={setSuccessMsg}
            setPage={setPage}
          />}
        {openDeleteForm &&
          <DeleteSourceForm 
            openDeleteForm={openDeleteForm}
            setOpenDeleteForm={setOpenDeleteForm}
            setOpenSource={setOpenSource}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            setSources={setSources}
            setError={setError}
            setErrorMsg={setErrorMsg}
            setSuccess={setSuccess}
            setSuccessMsg={setSuccessMsg}
          />
        }
      </div >
    </>
  )
};
