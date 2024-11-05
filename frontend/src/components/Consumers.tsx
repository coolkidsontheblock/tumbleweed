import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsumer, getConsumers } from "../services/consumerService";
import { ConsumerDetails } from "../types/types";
import { Consumer } from "./Consumer";
import { ConsumerForm } from "./ConsumerForm";
import { getTopics } from "../services/topicService"
import { ErrorSnack } from "./ErrorSnack";

export const Consumers = () => {
  const [consumers, setConsumers] = useState<string[]>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerDetails | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [topics, setTopics] = useState<string[]>([]);

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
  }, [])

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

  const handleNewConsumer = async () => {
    setOpen(true)
    const request = await getTopics()
    setTopics(request);
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
        <button className="connectionButton" onClick={handleNewConsumer}>Create New Consumer</button>
        
        { selectedConsumer ? 
        <>
          <Consumer consumerDetails={selectedConsumer} />
          {/* <button className="consumerButton" onClick={handleDeleteConsumer}>Delete Consumer</button> */}
        </> : null }
        <ConsumerForm
          setConsumers={setConsumers}
          setOpen={setOpen}
          open={open}
          setError={setError}
          setErrorMsg={setErrorMsg}
          topics={topics}
        />
      </div>
    </>
  )
}