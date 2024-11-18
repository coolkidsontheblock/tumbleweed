import { act, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { Topics } from "../Topics";
import { deleteTopic, getTopics } from "../../services/topicService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/topicService");

const mockedServices = vi.mocked({
  getTopics,
  deleteTopic
}, true)

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
    await act(async () => {
      render(
        <MemoryRouter>
          <Topics setLoading={vi.fn()}/>
        </MemoryRouter>
      );
    });
})

afterEach(() => {
  vi.resetAllMocks();
});

describe('Testing Topics component', async () => {
  it('Renders topics component and retrieves list of topics', async () => {
    const heading = screen.getByText(/Topic List/i);
    expect(heading).toBeInTheDocument();

    const topic = screen.getByText(/testTopic/);
    expect(topic).toBeInTheDocument();

    const topicDetailsHeader = screen.queryByText(/Topic information/i);
    expect(topicDetailsHeader).not.toBeInTheDocument();
  });

  it('Clicking a topic renders the topic component and details', async () => {
    const topic = screen.getByText(/testTopic/);
    expect(topic).toBeInTheDocument();
    await userEvent.click(topic);

    const topicDetailsHeader = screen.getByText(/Topic information/i);
    expect(topicDetailsHeader).toBeInTheDocument();

    const subscribedConsumers = screen.getByText(/consumer1, consumer2/);
    expect(subscribedConsumers).toBeInTheDocument();
  });

  it('Clicking a topic renders the topic component and clicking the delete topic button removes the topic', async () => {
    mockedServices.deleteTopic.mockResolvedValue('Topic testTopic deleted!');

    const topic = screen.getByText(/testTopic/);
    expect(topic).toBeInTheDocument();
    await userEvent.click(topic);

    const deleteTopicButton = screen.getByRole("button", { name: /delete topic/i });
    expect(deleteTopicButton).toBeInTheDocument();
    await userEvent.click(deleteTopicButton);

    const deletedText = screen.getByText(/Topic deleted successfully!/i);
    expect(deletedText).toBeInTheDocument();
  });
});
