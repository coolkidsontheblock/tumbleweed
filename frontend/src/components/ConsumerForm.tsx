import { useEffect, useState } from "react";
import { createConsumer } from "../services/consumerService";
import { BooleanObject, ConsumerInputDetails } from "../types/types";
import { Button, Box, Modal, TextField } from "@mui/material";
import { validateInput } from "../utils/validation";
import { getTopics } from "../services/topicService";
import { TopicSelect } from "./TopicSelect";
import { textFieldTheme } from '../styles/Theme';
import { ThemeProvider } from '@mui/material/styles';

interface ConsumerFormProps {
  setConsumers: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  openForm: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
}

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: "column",
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: '24px',
  p: 4,
  borderRadius: '15px',
};

export const ConsumerForm = ({
  setConsumers,
  setOpenForm,
  openForm,
  setError,
  setErrorMsg,
  setSuccess,
  setSuccessMsg
}: ConsumerFormProps) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  // const [tumbleweedEndpoint, setTumbleweedEndpoint] = useState<string>('');
  const [kafkaClientId, setKafkaClientId] = useState<string>('');
  const [kafkaGroupId, setKafkaGroupId] = useState<string>('');
  const [errors, setErrors] = useState<BooleanObject>({});
  const [topics, setTopics] = useState<BooleanObject>({});

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const request = await getTopics()
        const topicObject: BooleanObject = {}
        request.forEach(topic => topicObject[topic] = false)
        setTopics(topicObject);
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

    fetchTopics();
  }, []);

  const handleNewConsumer = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: BooleanObject = {};

    try {
      const subscribedTopics = Object.keys(topics).filter(topic => topics[topic]);
      const consumerData: ConsumerInputDetails = {
        name: validateInput(name),
        description: description,
        kafka_client_id: kafkaClientId,
        kafka_group_id: validateInput(kafkaGroupId),
        subscribed_topics: subscribedTopics
      };

      setErrors({});
      const res = await createConsumer(consumerData);
      setConsumers((prevConsumers) => prevConsumers.concat(res.data.name));

      setSuccess(true);
      setSuccessMsg("Consumer created successfully!");
      setOpenForm(false);
      setName('');
      setDescription('');
      setKafkaClientId('');
      setKafkaGroupId('');
    } catch (error) {
      setError(true);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unknown error occurred");
      }

      if (!name) newErrors.name = true;
      // if (!tumbleweedEndpoint) newErrors.tumbleweed_endpoint = true;
      // if (!kafkaClientId) newErrors.kafka_client_id = true;
      if (!kafkaGroupId) newErrors.kafka_group_id = true;

      setErrors(newErrors);
    }
  };

  const handleCloseModal = () => {
    setOpenForm(false);
    setErrors({});
  };

  return (
    <ThemeProvider theme={textFieldTheme}>
    <Modal open={openForm} onClose={handleCloseModal}>
      <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }} component="form">
        <h1 style={{ textAlign: 'center' }}>Connect a new consumer</h1>
        <p style={{ textAlign: 'center' }}>Please enter consumer details:</p>

        <TextField
          required
          id="name"
          label="Consumer Name"
          variant="outlined"
          error={errors.name}
          helperText={errors.name && "Consumer name is required"}
          onChange={(event) => setName(event.target.value)}
        />

        <TextField
          fullWidth
          id="description"
          label="Description (optional)"
          variant="outlined"
          onChange={(event) => setDescription(event.target.value)}
        />

        <TextField
          fullWidth
          id="kafkaClientId"
          label="Kafka Client Id (optional)"
          variant="outlined"
          onChange={(event) => setKafkaClientId(event.target.value)}
        />

        <TextField
          fullWidth
          required
          id="kafkaGroupId"
          label="Kafka Group Id"
          variant="outlined"
          error={errors.kafka_group_id}
          helperText={errors.kafka_group_id && "Kafka group id is required and needs to be unique"}
          onChange={(event) => setKafkaGroupId(event.target.value)}
        />
        <TopicSelect
          topics={topics}
          setTopics={setTopics}
        />
        <Box>
        <Button variant="contained" 
            onClick={handleNewConsumer} 
            sx={{ 
              marginRight: '10px',
              fontFamily: "Montserrat",
              fontWeight: 400,
              borderRadius: '30px',
              // border: '3px solid #331E14',
              backgroundColor: '#70AF85',
              '&:hover': {
                backgroundColor: '#F58B33', // Change color on hover
              }, 
              }}>
            Connect
          </Button>
          <Button variant="outlined" 
            onClick={handleCloseModal}
            sx={{ 
              fontFamily: "Montserrat",
              fontWeight: 400,
              borderRadius: '30px',
              border: '1px solid #70AF85',
              color: '#70AF85',
              '&:hover': {
                border: '1px solid #F58B33',
                color: '#F58B33'
              }, 
              }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
    </ThemeProvider>
  );
};