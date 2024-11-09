import { SourceData } from '../types/types';
import { SourceForm } from "./SourceForm";
import { getSources, getSource, deleteSource } from "../services/sourcesService";
import { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from './Loading';
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




export const Sources = () => {
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<SourceData | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [openSourceForm, setOpenSourceForm] = useState<boolean>(false);
  const [openSource, setOpenSource] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const request = await getSources();
        setSources(request);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg("An unknown error occurred");
        }
      }
    }

    fetchSources();
  }, [])

  const handleSelectedSource = async (source: string) => {
    try {
      const response = await getSource(source);
      setSelectedSource(response.data);
    } catch (error) {
      console.error(error);
      setError(true);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unknown error occurred");
      }
    }
  }

  const handleDeleteSource = async () => {
    try {
      if (selectedSource) {
        const source = selectedSource.name;
        await deleteSource(source);
        setSources(prevSources => prevSources.filter(sourceString => sourceString !== source));
        setSelectedSource(null);
      }
    } catch (error) {
      console.error(error);
      setError(true);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unknown error occurred");
      }
    }
  }

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page is changed
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
      {loading && <Loading />}
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
          <TableContainer component={Paper} sx={{maxWidth: '100%', overflowX: 'auto', marginLeft: "50px", marginRight: "50px", boxSizing: 'border-box' }}>
            <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small" aria-label="source list table">
            <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700, position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Date Added</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{marginRight: '100px'}}>
                {currentSources.map(sourceName => (
                  <TableRow key={sourceName}>
                    <TableCell sx={{ 
                      padding: '8px',
                      fontSize: '0.875rem',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#fff',
                      zIndex: 1,
                    }}>
                      <Link
                        className="link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectedSource(sourceName);
                          setOpenSource(true);
                        }}
                        to={''}
                      >
                        {sourceName}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400, padding: '8px', fontSize: '0.875rem' }}>Some Data</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              mr: 9.5
            }}
          ></Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mr: 9.5, marginLeft: "50px"}}>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                className="connectionButton" 
                onClick={() => setOpenSourceForm(true)}
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: 400,
                  // border: '3px solid #331E14',
                  backgroundColor: '#70AF85',
                  '&:hover': {
                    backgroundColor: '#F58B33', // Change color on hover
                  },
                }}
                >Create New Source</Button>
            </Box>
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
          {/* <ul className="connection-ul">
            {sources.map(sourceName => (
              <li className="list" key={sourceName}>
                <Link className="link" onClick={(e) => {
                  e.preventDefault();
                  handleSelectedSource(sourceName);
                  setOpenSource(true);
                }
                } to={''}>
                  {sourceName}
                </Link>
              </li>
            ))}
          </ul> */}
        </div>
        {selectedSource && openSource &&
          <>
            <Source
              setOpenSource={setOpenSource}
              openSource={openSource}
              handleDeleteSource={handleDeleteSource}
              sourceData={selectedSource}
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
          />}
      </div >
    </>
  )
};