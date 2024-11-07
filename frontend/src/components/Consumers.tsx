import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsumer, getConsumers } from "../services/consumerService";
import { ConsumerDetails } from "../types/types";
import { Consumer } from "./Consumer";
import { ConsumerForm } from "./ConsumerForm";
import { ErrorSnack } from "./ErrorSnack";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { a } from "vitest/dist/suite-IbNSsUWN.js";
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
      <TableContainer component={Paper}>
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
      </TableContainer>

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
      <button className="connectionButton" onClick={() => setOpenForm(true)}>Create New Consumer</button>

      {selectedConsumer && openConsumer &&
        <>
          <Consumer
            setOpenConsumer={setOpenConsumer}
            openConsumer={openConsumer}
            selectedConsumer={selectedConsumer} />
          {/* <button className="consumerButton" onClick={handleDeleteConsumer}>Delete Consumer</button> */}
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