import { TopicsData } from '../types/types';
import { deleteTopic, getTopics } from "../services/topicService";
import { TopicInfo } from './Topic';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { sortTopicsByDate } from "../utils/sorting";
import { ZodError } from 'zod';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

interface TopicsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Topics = ({ setLoading }: TopicsProps) => {
  const [topics, setTopics] = useState<TopicsData[] | null>(null)
  const [topicNames, setTopicNames] = useState<string[] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicsData | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const request = await getTopics();
        const listOfTopics = request.data.map(topicObj => topicObj.topic);
        const data = sortTopicsByDate(request.data);

        setTopicNames(listOfTopics);
        setTopics(data);
      } catch (error) {
        console.error(error);
        setError(true);
        if (error instanceof ZodError) {
          setErrorMsg('There was an error fetching the data. Please try again later.');
        } else {
          setErrorMsg("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, [])

  const currentTopics = topics?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setError(false);
    setErrorMsg('');
    setSuccess(false);
    setSuccessMsg('');
  }

  const handleDeleteTopic = async () => {
    try {
      if (topics && selectedTopic) {
        const topic = selectedTopic.topic;
        await deleteTopic(topic);
        setTopics(prevTopics =>
          prevTopics ? prevTopics.filter(topicObj => topicObj.topic !== topic) : null
        );
        setOpen(false);
        setSuccess(true);
        setSuccessMsg("Topic deleted successfully!");
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
        {success && (
          <SuccessSnack
            message={successMsg}
            handleCloseSnackbar={handleCloseSnackbar}
            openStatus={success}
          />
        )}
        <div id="sourcelist">
          <h1>Topic List</h1>
          {topicNames === null ? (
            <></>
          ) : topicNames.length > 0 ? (
            <>
              <TableContainer component={Paper}
                sx={{
                  borderRadius: '15px',
                  maxWidth: '100%',
                  overflowX: 'auto',
                  marginLeft: "50px",
                  marginRight: "50px",
                  boxSizing: 'border-box'
                }}
              >
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="consumer list table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700, position: 'sticky',
                          left: 0,
                          backgroundColor: '#fff',
                          zIndex: 1
                        }}>
                        Name
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 700
                      }}
                      >
                        Subscriber Count
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 700
                      }}
                      >
                        Date Added
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentTopics.map((topic) => (
                      <TableRow key={topic.topic}>
                        <TableCell sx={{ fontSize: '0.875rem' }}>
                          <Link
                            className="link"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTopic(topic);
                              setOpen(true);
                            }}
                            to={''}
                          >
                            {topic.topic}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {topic.subscribed_consumers.length}
                        </TableCell>
                        <TableCell>
                          {topic.date_added}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={topicNames?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '& .MuiTablePagination-toolbar': { minHeight: '36px' },
                  '& .MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows': {
                    fontSize: '0.75rem', fontFamily: "Montserrat", fontWeight: 400
                  },
                }}
              />
            </>
          ) : (<h2 id="no_topics_heading">There are no topics</h2>)}
        </div>
        {selectedTopic && open &&
          <>
            <TopicInfo
              setOpen={setOpen}
              open={open}
              topicInfo={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              handleDeleteTopic={handleDeleteTopic}
            />
          </>
        }
      </div>
    </>
  )
};
