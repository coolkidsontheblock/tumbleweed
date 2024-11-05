import { SourceData } from '../types/types';
import { CreateSourceForm } from "./CreateSourceForm";
import { getSources, getSource, deleteSource } from "../services/sourcesService";
import { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link, useNavigate } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from './Loading';

export const Sources = () => {
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<SourceData | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSources() {
      try {
        const request = await getSources();
        setSources(request);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
    }
  }

  const handleCloseSnackbar = () => {
    setError(false);
    setErrorMsg('');
    setSuccess(false);
    setSuccessMsg('');
  }
  // const handleLinkClick = (event: React.SyntheticEvent | Event, source) => {
  //   event.preventDefault()
  //   handleSelectedSource(source);
  //   navigate(`/sources/${source}`);
  //   // window.history.pushState({}, '', `/sources/${source}`);
  // }

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
          <ul className="connection-ul">
          {sources.map(sourceName => (
            <li className="list" key={sourceName}>
            <Link className="link" onClick={() => handleSelectedSource(sourceName)} to={''}>
              {sourceName}
            </Link>
            </li>
          ))}
          </ul>
        </div>
        <button className="connectionButton" onClick={() => setOpen(true)}>Create New Source</button>
        { selectedSource ? 
        <>
          <Source sourceData={selectedSource} />
          <button className="connectionButton" onClick={handleDeleteSource}>Delete Source</button>
        </> : null }
        <CreateSourceForm
          setSources={setSources}
          setOpen={setOpen}
          open={open}
          setError={setError}
          setErrorMsg={setErrorMsg}
          setSuccess={setSuccess}
          setSuccessMsg={setSuccessMsg}
        />
      </div>
    </>
    )
};