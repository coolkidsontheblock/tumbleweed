// import { SourceType } from '../utils/types/types';
import { CreateSourceForm } from "./CreateSourceForm";
import { getSources, getSource } from "../services/sourcesService";
import React, { useEffect, useState } from "react";
import { Source } from "./Source";
import { Link, useNavigate } from "react-router-dom";

export const Sources = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<string[]>([]);
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<string>('')

  useEffect(() => {
    async function fetchSources() {
      try {
        const request = await getSources();
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
      setSelectedSource(response);
    } catch (error) {
      console.error(error);
    }
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
        <button onClick={() => setDisplayForm(true)}>Create New Source</button>
        <ul id="sourcelist">
 
        {sources.map(source => (
          <li key={source}>
            <Link to={`/sources/${source}`} onClick={() => handleSelectedSource(source)}>
              {source}
            </Link>
          </li>
 
        ))}
        </ul>
        {selectedSource}
        { displayForm ? <CreateSourceForm /> : null }
      </div>
    </>
    )
};