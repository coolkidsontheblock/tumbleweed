import { SourceData } from '../types/types';
import { SourceForm } from "./SourceForm";
import { getSources, getSource, deleteSource } from "../services/sourcesService";
import { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from './Loading';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';




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

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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
          <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: '0 auto' }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="consumer list table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Source Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSources.map(sourceName => (
                  <TableRow key={sourceName}>
                    <TableCell sx={{ padding: '8px', fontSize: '0.875rem' }}>
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
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mr: 9.5 }}>
            <Box sx={{ mt: 2 }}>
              <button className="connectionButton" onClick={() => setOpenSourceForm(true)}>Create New Source</button>
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
                  fontSize: '0.75rem',
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
              sourceData={selectedSource}
            />
            <button className="connectionButton" onClick={handleDeleteSource}>Delete Source</button>
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