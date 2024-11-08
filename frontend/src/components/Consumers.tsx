import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsumer, getConsumers, deleteConsumer } from "../services/consumerService";
import { ConsumerDetails } from "../types/types";
import { Consumer } from "./Consumer";
import { ConsumerForm } from "./ConsumerForm";
import { ErrorSnack } from "./ErrorSnack";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box } from '@mui/material';
// import { a } from "vitest/dist/suite-IbNSsUWN.js";
import { SuccessSnack } from "./SuccessSnack";

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

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page is changed
  };

  const currentConsumers = consumers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCloseSnackbar = () => {
    setError(false);
    setErrorMsg('');
    setSuccess(false);
    setSuccessMsg('');
  }

  return (
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
        <h2>Consumer List</h2>
        <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: '0 auto' }}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="consumer list table">
            {/* <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Consumer Name</TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {currentConsumers.map(consumerName => (
                <TableRow key={consumerName}>
                  <TableCell sx={{ padding: '8px', fontSize: '0.875rem' }}>
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
            <button className="connectionButton" onClick={() => setOpenForm(true)}>Create New Consumer</button>
          </Box>
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
                fontSize: '0.75rem',
              },
            }}
          />
        </Box>
        {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 50 }} aria-label="consumer list table">
          <TableHead>
            <TableRow>
              <TableCell>Consumer Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumers.map(consumerName => (
              <TableRow key={consumerName}>
                <TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

        {/* <div id="consumerlist">
        <h2>Consumer List</h2>
        <ul className="connection-ul">
          {consumers.map(consumerName => (
            <li className="list" key={consumerName}>
              <Link className="link" onClick={(e) => {
                handleSelectedConsumer(consumerName)
                setOpenConsumer(true)
              }} to={''}>
                {consumerName}
              </Link>
            </li>
          ))}
        </ul>
      </div> */}
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
  )
}