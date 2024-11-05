import { SourceData } from '../types/types';
import { CreateSourceForm } from "./CreateSourceForm";
import { getSources, getSource, deleteSource } from "../services/sourcesService";
import React, { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link, useNavigate } from "react-router-dom";
import { ErrorBanner } from "./ErrorBanner";

export const Sources = () => {
  const [sources, setSources] = useState<string[]>([]);
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<SourceData | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    async function fetchSources() {
      try {
        const request = await getSources();
        console.log(request)
        setSources(request);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSources();
  }, [])

  const handleSelectedSource = async (source: string) => {
    try {
      const response = await getSource(source);
      console.log(response.data)
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

  const handleClose = () => {
    setError(false);
    setErrorMsg('');
  }
  // const handleLinkClick = (event: React.SyntheticEvent | Event, source) => {
  //   event.preventDefault()
  //   handleSelectedSource(source);
  //   navigate(`/sources/${source}`);
  //   // window.history.pushState({}, '', `/sources/${source}`);
  // }

  return (
    <>
      <div id="sources">
        {error && (
          <ErrorBanner
            message={errorMsg}
            handleClose={handleClose}
            openStatus={error}
          />
        )}
        {/* <button className="sourceButton" onClick={() => setDisplayForm(true)}>Create New Source</button> */}
        <div id="sourcelist">
          <h2>Source List</h2>
          <ul id="source-ul">
          {sources.map(sourceName => (
            <li key={sourceName}>
            <Link onClick={() => handleSelectedSource(sourceName)} to={''}>
              {sourceName}
            </Link>
            </li>
          ))}
          </ul>
        </div>
        <button className="sourceButton" onClick={() => setDisplayForm(true)}>Create New Source</button>
        { selectedSource ? 
        <>
          <Source sourceData={selectedSource} />
          <button className="sourceButton" onClick={handleDeleteSource}>Delete Source</button>
        </> : null }

        { displayForm ? <CreateSourceForm setSources={setSources} /> : null }
      </div>
    </>
    )
};