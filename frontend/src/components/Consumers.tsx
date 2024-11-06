import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsumer, getConsumers } from "../services/consumerService";
import { BooleanObject, ConsumerInputDetails } from "../types/types";
import { Consumer } from "./Consumer";
import { ConsumerForm } from "./ConsumerForm";
// import { getTopics } from "../services/topicService"
import { ErrorSnack } from "./ErrorSnack";
import { a } from "vitest/dist/suite-IbNSsUWN.js";

export const Consumers = () => {
  const [consumers, setConsumers] = useState<string[] | []>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerInputDetails | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchConsumers() {
      try {
        const request = await getConsumers();
        setConsumers(request.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchConsumers();
  }, []);

  // useEffect(() => {
  //   async function fetchTopics() {
  //     try {
  //       const request = await getTopics()
  //       const topicObject: { [key: string]: boolean } = {}
  //       request.forEach(topic => topicObject[topic] = false)
  //       setTopics(topicObject);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchTopics();
  // }, []);

  const handleSelectedConsumer = async (Consumer: string) => {
    try {
      const response = await getConsumer(Consumer);
      setSelectedConsumer(response.data);
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

  return (
    <>
    <div className="connectionlist">
        {error && (
          <ErrorSnack
            message={errorMsg}
            handleCloseSnackbar={handleCloseSnackbar}
            openStatus={error}
          />
        )}
        {/* <button className="consumerButton" onClick={() => setDisplayForm(true)}>Create New Consumer</button> */}
        <div id="consumerlist">
          <h2>Consumer List</h2>
          <ul className="connection-ul">
          {consumers.map(consumerName => (
            <li className="list" key={consumerName}>
            <Link className="link" onClick={() => handleSelectedConsumer(consumerName)} to={''}>
              {consumerName}
            </Link>
            </li>
          ))}
          </ul>
        </div>
        <button className="connectionButton" onClick={() => setOpen(true)}>Create New Consumer</button>
        
        { selectedConsumer ? 
        <>
          <Consumer consumerDetails={selectedConsumer} />
          {/* <button className="consumerButton" onClick={handleDeleteConsumer}>Delete Consumer</button> */}
        </> : null }
        { open ? 
        <ConsumerForm
          setConsumers={setConsumers}
          setOpen={setOpen}
          open={open}
          setError={setError}
          setErrorMsg={setErrorMsg}
        /> : null }
      </div>
    </>
  )
}