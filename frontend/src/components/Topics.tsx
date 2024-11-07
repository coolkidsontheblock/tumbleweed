import { TopicResponse } from '../types/types';
import { getTopics, getTopic } from "../services/topicService";
import { TopicInfo } from './Topic';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from './Loading';

export const Topics = () => {
  const [topics, setTopics] = useState<string[]>();
  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const request = await getTopics();
        setTopics(request);
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

  const handleSelectedTopic = async (source: string) => {
    try {
      const response = await getTopic(source);
      console.log(response)
      setSelectedTopic(response);
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
          <ul className="connection-ul">
            {topics && topics.length > 0 ? topics.map(topicName => (
              <li className="list" key={topicName}>
                <Link className="link" onClick={(e) => {
                  e.preventDefault();
                  handleSelectedTopic(topicName)
                  setOpen(true)
                }} to={''}>
                  {topicName}
                </Link>
              </li>
            )) : <li>No topics available</li>}
          </ul>
        </div>
        {selectedTopic && open &&
          <>
            <TopicInfo
              setOpen={setOpen}
              open={open}
              topicData={selectedTopic.data}
            />
          </>}
      </div>
    </>
  )
};