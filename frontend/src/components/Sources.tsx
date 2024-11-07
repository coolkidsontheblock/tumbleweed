import { SourceData } from '../types/types';
import { SourceForm } from "./SourceForm";
import { getSources, getSource, deleteSource } from "../services/sourcesService";
import { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from './Loading';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


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
          <h2>Source List</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="source list table">
              <TableHead>
                <TableRow>
                  <TableCell>Source Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sources.map(sourceName => (
                  <TableRow key={sourceName}>
                    <TableCell>{sourceName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
        <button className="connectionButton" onClick={() => setOpenSourceForm(true)}>Create New Source</button>
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
      </div>
    </>
  )
};