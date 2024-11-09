import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsumer, getConsumers, deleteConsumer } from "../services/consumerService";
import { ConsumerDetails } from "../types/types";
import { Consumer } from "./Consumer";
import { ConsumerForm } from "./ConsumerForm";
import { ErrorSnack } from "./ErrorSnack";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, Button } from '@mui/material';
// import { a } from "vitest/dist/suite-IbNSsUWN.js";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from "./Loading";

export const Consumers = () => {
  const [consumers, setConsumers] = useState<string[] | []>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerDetails | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openConsumer, setOpenConsumer] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchConsumers = async (): Promise<void> => {
      try {
        const request = await getConsumers();
        setConsumers(request.data);
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

    fetchConsumers();
    setLoading(false);
  }, []);

  const handleSelectedConsumer = async (Consumer: string): Promise<void> => {
    try {
      const request = await getConsumer(Consumer);
      setSelectedConsumer(request.data);
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

  const handleDeleteConsumer = async () => {
    try {
      if (selectedConsumer) {
        const source = selectedConsumer.name;
        await deleteConsumer(source);
        setConsumers(prevSources => prevSources.filter(sourceString => sourceString !== source));
        setSelectedConsumer(null);
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
    setPage(0); 
  };

  const currentConsumers = consumers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <div id="consumerlist">
          <h1>Consumer List</h1>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', marginLeft: "50px", marginRight: "50px", boxSizing: 'border-box' }}>
            <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small" aria-label="consumer list table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700, position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Date Added</TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscribed Topics</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentConsumers.map(consumerName => (
                  <TableRow key={consumerName}>
                    <TableCell
                      sx={{
                        padding: '8px',
                        fontSize: '0.875rem',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#fff',
                        zIndex: 1, 
                      }}
                    >
                      <Link
                        className="link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectedConsumer(consumerName);
                          setOpenConsumer(true);
                        }}
                        to={''}
                      >
                        {consumerName}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400, padding: '8px', fontSize: '0.875rem' }}>Some Data</TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400, padding: '8px', fontSize: '0.875rem' }}>More Data</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ width: '100%', marginTop: 2, marginLeft: 6 }}>
            <Box sx={{ flex: 'none' }}>
              <Button variant="contained"
                className="connectionButton"
                onClick={() => setOpenForm(true)}
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: 400,
                  // border: '3px solid #331E14',
                  backgroundColor: '#70AF85',
                  '&:hover': {
                    backgroundColor: '#F58B33', // Change color on hover
                  },
                }}
              >
                Create New Consumer
              </Button>
            </Box>

            <Box sx={{ flex: 'none' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={consumers.length}
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
          </Box>
        </div>


        {selectedConsumer && openConsumer &&
          <>
            <Consumer
              setOpenConsumer={setOpenConsumer}
              openConsumer={openConsumer}
              handleDeleteConsumer={handleDeleteConsumer}
              selectedConsumer={selectedConsumer} />
          </>}
        {openForm &&
          <ConsumerForm
            setConsumers={setConsumers}
            setOpenForm={setOpenForm}
            openForm={openForm}
            setError={setError}
            setErrorMsg={setErrorMsg}
            setSuccess={setSuccess}
            setSuccessMsg={setSuccessMsg}
          />}
      </div>
    </>
  )
}