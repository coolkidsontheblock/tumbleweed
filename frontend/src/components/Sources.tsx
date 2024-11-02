// import { useState, useEffect } from 'react';
// import { Source } from '../utils/types/SourceTypes';
import { CreateSourceForm } from "./CreateSourceForm";
// import { getSources } from "../services/sourcesService";
// import { useEffect, useState } from "react";

export const Sources = () => {
  // const [sources, setSources] = useState([]);

  // useEffect(() => {
  //   async function fetchSources() {
  //     try {
  //       const request = await getSources();
  //       return request;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   setSources(fetchSources());
  // }, [])

  return (
    <>
      <CreateSourceForm />
      {/* <div className='source-page'>
        <button onClick={handleNewSource}>Create Source</button>
      </div> */}
    </>
    )
};