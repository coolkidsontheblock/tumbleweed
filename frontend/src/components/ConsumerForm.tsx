import { useEffect, useState } from "react";
import { createConsumer } from "../services/consumerService";
import { BooleanObject, ConsumerInputDetails } from "../types/types";
import { Button, Box, Modal, TextField } from "@mui/material";
import { validateInput } from "../utils/validation";
import { getTopics } from "../services/topicService";
import { TopicSelect } from "./TopicSelect";

interface ConsumerFormProps {
  setConsumers: React.Dispatch<React.SetStateAction<string[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
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
  setOpen,
  open,
  setError,
  setErrorMsg,
  setSuccess,
  setSuccessMsg
}: ConsumerFormProps) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [endpointUrl, setEndpointUrl] = useState<string>('');
  const [kafkaClientId, setKafkaClientId] = useState<string>('');
  const [kafkaBrokerEndpoints, setKafkaBrokerEndpoints] = useState<string>('');
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
      const subscribedTopics = Object.keys(topics).filter(topic => topics[topic]).join(',');
      const consumerData: ConsumerInputDetails = {
        name: validateInput(name),
        description: description,
        endpoint_URL: validateInput(endpointUrl),
        kafka_client_id: validateInput(kafkaClientId),
        kafka_broker_endpoints: validateInput(kafkaBrokerEndpoints),
        kafka_group_id: validateInput(kafkaGroupId),
        subscribed_topics: subscribedTopics
      };

      setErrors({});
      const res = await createConsumer(consumerData);
      setConsumers((prevConsumers) => prevConsumers.concat(res.data.name));

      setSuccess(true);
      setSuccessMsg("Consumer created successfully!");
      setOpen(false);
      setName('');
      setDescription('');
      setKafkaClientId('');
      setKafkaBrokerEndpoints('');
      setKafkaGroupId('');
    } catch (error) {
      setError(true);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unknown error occurred");
      }

      if (!name) newErrors.name = true;
      if (!endpointUrl) newErrors.endpoint_URL = true;
      if (!kafkaClientId) newErrors.kafka_client_id = true;
      if (!kafkaBrokerEndpoints) newErrors.kafka_broker_endpoints = true;
      if (!kafkaGroupId) newErrors.kafka_group_id = true;

      setErrors(newErrors);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={{ ...style, '& > :not(style)': { m: 1, width: 'auto' } }} component="form">
        <h2 style={{ textAlign: 'center'}}>Connect a new consumer</h2>
        <p style={{ textAlign: 'center'}}>Please enter consumer details:</p>
        
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
          required
          id="description"
          label="Description (optional)"
          variant="outlined"
          onChange={(event) => setDescription(event.target.value)}
        />
        
        <TextField
          fullWidth
          required
          id="endpointUrl"
          label="Endpoint Url"
          variant="outlined"
          error={errors.endpoint_URL}
          helperText={errors.endpoint_URL && "Database URL is required"}
          onChange={(event) => setEndpointUrl(event.target.value)}
        />
        
        <TextField
          fullWidth
          required
          id="kafkaClientId"
          label="Kafka Client Id"
          variant="outlined"
          error={errors.kafka_client_id}
          helperText={errors.kafka_client_id && "Kafka client id is required"}
          onChange={(event) => setKafkaClientId(event.target.value)}
        />
        
        <TextField
          fullWidth
          required
          id="kafkaBrokerEndpoints"
          label="Kafka Broker Endpoints"
          variant="outlined"
          error={errors.kafka_broker_endpoints}
          helperText={errors.kafka_broker_endpoints && "Kafka broker endpoints is required"}
          onChange={(event) => setKafkaBrokerEndpoints(event.target.value)}
        />
        
        <TextField
          fullWidth
          required
          id="kafkaGroupId"
          label="Kafka Group Id"
          variant="outlined"
          error={errors.kafka_group_id}
          helperText={errors.kafka_group_id && "Kafka group id is required"}
          onChange={(event) => setKafkaGroupId(event.target.value)}
        />
        
        <TopicSelect topics={topics} setTopics={setTopics}/>
        
        <Box>
          <Button variant="contained" onClick={handleNewConsumer} sx={{marginRight: '10px'}}>
            Connect
          </Button>
          <Button variant="contained" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};