import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConsumerForm } from "../ConsumerForm";
import { textFieldTheme } from "../../styles/Theme";
import { ThemeProvider } from "@emotion/react";
import { ErrorSnack } from "../ErrorSnack";
import { createConsumer } from "../../services/consumerService";
import { getTopics } from "../../services/topicService";
import { act } from "react";

vi.mock("../../services/consumerService");
vi.mock("../../services/topicService");

const mockedServices = vi.mocked({
  createConsumer,
  getTopics
}, true);

const mockConsumerData = {
  message: 'testmessage',
  data: [{
    name: 'testuser',
    description: 'optionaldescription',
    tumbleweed_endpoint: 'http://localhost/tumbleweed/testuser',
    kafka_client_id: 'testuser-client',
    kafka_broker_endpoints: ['kafka-1:19092', 'kafka-2:19092', 'kafka-3:19092'],
    kafka_group_id: 'testgroupid',
    subscribed_topics: ['orders', 'products'],
    received_message_count: 0,
    date_created: 'November 15, 2024 at 09:51 AM PST'
  }]
}

const mockTopicsData = {
  message: 'testmessage',
  data: [{
    topic: 'testTopic',
    subscribed_consumers: ['consumer1', 'consumer2'],
    date_added: 'November 15, 2024 at 09:51 AM PST',
    message_count: 10
  }]
};

beforeEach(async () => {
  mockedServices.getTopics.mockResolvedValue(mockTopicsData);
})

afterEach(() => {
  vi.resetAllMocks();
});

describe('Testing ConsumerForm component', async () => {
  it('Renders consumer form fields', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={textFieldTheme}>
        <ConsumerForm
          setConsumers={vi.fn()}
          setOpenForm={vi.fn()}
          openForm={true}
          setError={vi.fn()}
          setErrorMsg={vi.fn()}
          setSuccess={vi.fn()}
          setSuccessMsg={vi.fn()}
          />
        </ThemeProvider>
      );
    });

    expect(screen.getByText(/Connect a new consumer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Consumer Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kafka Group Id/i)).toBeInTheDocument();
    expect(screen.getByText(/Select topics to subscribe to:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('Displays error message when required fields are missing', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={textFieldTheme}>
          <ConsumerForm
            setConsumers={vi.fn()}
            setOpenForm={vi.fn()}
            openForm={true}
            setError={vi.fn()}
            setErrorMsg={vi.fn()}
            setSuccess={vi.fn()}
            setSuccessMsg={vi.fn()}
          />
          <ErrorSnack
            message="Missing input."
            handleCloseSnackbar={vi.fn()}
            openStatus={true}
          />
        </ThemeProvider>
      );
    });

    userEvent.click(screen.getByRole('button', { name: /Connect/i }));
    expect(screen.getByText(/Missing input./i)).toBeInTheDocument();
  });

  it('Closes the modal when cancel button is clicked', async () => {
    const mockSetOpenForm = vi.fn();
    
    render(
      <ThemeProvider theme={textFieldTheme}>
        <ConsumerForm
          setConsumers={vi.fn()}
          setOpenForm={mockSetOpenForm}
          openForm={true}
          setError={vi.fn()}
          setErrorMsg={vi.fn()}
          setSuccess={vi.fn()}
          setSuccessMsg={vi.fn()}
        />
      </ThemeProvider>
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
  
    await waitFor(() => {
      expect(mockSetOpenForm).toHaveBeenCalledWith(false);
    });
  });

  it('Creating new source closes modal and displays success message', async () => {
    mockedServices.createConsumer.mockResolvedValue(mockConsumerData.data);
    const mockSetOpenForm = vi.fn();
    const mockSuccess = vi.fn();
    const mockSetSuccessMsg = vi.fn();

    render(
      <ThemeProvider theme={textFieldTheme}>
      <ConsumerForm
        setConsumers={vi.fn()}
        setOpenForm={mockSetOpenForm}
        openForm={true}
        setError={vi.fn()}
        setErrorMsg={vi.fn()}
        setSuccess={mockSuccess}
        setSuccessMsg={mockSetSuccessMsg}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /Connect/i })).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Consumer Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const kafkaGroupId = screen.getByLabelText(/Kafka Group Id/i);
    const selectedTopics = screen.getByText(/Select topics to subscribe to:/i);

    await userEvent.type(nameInput, 'testuser');
    await userEvent.type(descriptionInput, 'optionaldescription');
    await userEvent.type(kafkaGroupId, 'testgroupid');
    await userEvent.type(selectedTopics, 'orders,products');

    const connectButton = screen.getByRole('button', { name: /Connect/i });
    userEvent.click(connectButton);

    await waitFor(() => {
      expect(mockSetOpenForm).toHaveBeenCalledWith(false);
      expect(mockSuccess).toHaveBeenCalledWith(true);
      expect(mockSetSuccessMsg).toHaveBeenCalledWith("Consumer created successfully!");
    });
  });
});
