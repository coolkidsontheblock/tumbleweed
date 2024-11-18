import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Consumers } from "../Consumers";
import { deleteConsumer, getConsumers } from "../../services/consumerService";
import { getTopics } from "../../services/topicService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/topicService");
vi.mock("../../services/consumerService");

const mockedServices = vi.mocked({
  getConsumers,
  deleteConsumer,
  getTopics
}, true)

const mockConsumerData = {
  message: 'testmessage',
  data: [{
    name: 'testuser',
    description: 'optionaldescription',
    tumbleweed_endpoint: 'http://localhost/tumbleweed/testuser',
    kafka_client_id: 'testuser-client',
    kafka_broker_endpoints: ['kafka-1:19092', 'kafka-2:19092', 'kafka-3:19092'],
    kafka_group_id: 'testuser',
    subscribed_topics: ['orders', 'products'],
    received_message_count: 0,
    date_created: 'November 15, 2024 at 09:51 AM PST'
  }]
}

beforeEach(async () => {
  mockedServices.getConsumers.mockResolvedValue(mockConsumerData);
  await act(async () => {
    render(
      <MemoryRouter>
        <Consumers setLoading={vi.fn()} />
      </MemoryRouter>
    );
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Testing Consumers component', async () => {
  it('Renders consumer component and retrieves list of consumers', async () => {
    const heading = screen.getByText(/Consumer List/i);
    expect(heading).toBeInTheDocument();

    const consumer = screen.getByText(/testuser/);
    expect(consumer).toBeInTheDocument();

    const createConsumerButton = screen.getByRole("button", { name: /Create New Consumer/i });
    expect(createConsumerButton).toBeInTheDocument();
  });

  it('Clicking a consumer name renders Consumer component and details', async () => {
    const consumer = screen.getByText(/testuser/);
    await userEvent.click(consumer);
    
    const consumerDetails = screen.getByText(/consumer details/i);
    expect(consumerDetails).toBeInTheDocument();
  });

  it('Create new Consumer button renders new Consumer form', async () => {
    const mockTopicsData = {
      message: 'testmessage',
      data: [{
        topic: 'testTopic',
        subscribed_consumers: ['consumer1', 'consumer2'],
        date_added: 'November 15, 2024 at 09:51 AM PST',
        message_count: 10
      }]
    };
    mockedServices.getTopics.mockResolvedValue(mockTopicsData);
    
    const createConsumerButton = screen.getByRole("button", { name: /Create New Consumer/i });

    await userEvent.click(createConsumerButton);
    const consumerFormHeading = screen.getByText('Connect a new consumer');
    expect(consumerFormHeading).toBeInTheDocument;
  });

  it('Clicking delete button in consumer details deletes consumer', async () => {
    mockedServices.deleteConsumer.mockResolvedValue('Connector testuser deleted!');

    const source = screen.getByText(/testuser/);
    await userEvent.click(source);

    const deleteButton = screen.getByRole("button", { name: /delete consumer/i });
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);

    const deletedText = screen.getByText(/Consumer deleted successfully!/i);
    expect(deletedText).toBeInTheDocument();
  });
});
