import { TopicResponse } from '../types/types';
import { getTopics, getTopic } from "../services/topicService";
import { TopicInfo } from './Topic';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorSnack } from "./ErrorSnack";
import { SuccessSnack } from "./SuccessSnack";
import { Loading } from './Loading';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

export const Topics = () => {
  const [topics, setTopics] = useState<string[]>();
  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(null)
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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


  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page is changed
  };

  const currentTopics = topics?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];


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
          <h1>Topic List</h1>
          <TableContainer component={Paper} sx={{ borderRadius: '15px', maxWidth: '100%', overflowX: 'auto', marginLeft: "50px", marginRight: "50px", boxSizing: 'border-box' }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="consumer list table">
            <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700, position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 700 }}>Subscribers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTopics.map(topicName => (
                  <TableRow key={topicName}>
                    <TableCell sx={{fontSize: '0.875rem' }}>
                      <Link
                        className="link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectedTopic(topicName);
                          setOpen(true);
                        }}
                        to={''}
                      >
                        {topicName}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat", fontWeight: 400, fontSize: '0.875rem' }}>Some Data</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={topics?.length || 0}
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
          {/* <div id="topiclist">
          <h2>Topic List</h2>
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
        </div> */}
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