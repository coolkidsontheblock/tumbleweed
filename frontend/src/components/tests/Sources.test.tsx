import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Sources } from "../Sources";
import { getSources, deleteSource } from "../../services/sourcesService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/sourcesService");

const mockedServices = vi.mocked({
  getSources,
  deleteSource
}, true)

const mockSourceData = {
  message: 'testmessage',
  data: [{
    database_dbname: 'testdatabase',
    database_hostname: 'testhostname',
    database_port: 5432,
    database_server_name: 'testservername',
    database_user: 'testuser',
    date_created: 'November 15, 2024 at 09:51 AM PST',
    name: 'testname',
    slot_name: 'tumbleweed_testname'
  }]
}

beforeEach(async () => {
  mockedServices.getSources.mockResolvedValue(mockSourceData);
  await act(async () => {
    render(
      <MemoryRouter>
        <Sources setLoading={vi.fn()}/>
      </MemoryRouter>
    );
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Testing Sources component', async () => {
  it('Renders source component and retrieves list of sources', async () => {
    const heading = screen.getByText(/Source List/);
    expect(heading).toBeInTheDocument();

    const source = screen.getByText(/testname/);
    expect(source).toBeInTheDocument();

    const createSourceButton = screen.getByRole("button", { name: /create new source/i });
    expect(createSourceButton).toBeInTheDocument();
  });

  it('Clicking a source name renders Source component and details', async () => {
    const source = screen.getByText(/testname/);
    await userEvent.click(source);

    const consumerDetails = screen.getByText(/source details/i);
    expect(consumerDetails).toBeInTheDocument();
  });

  it('Clicking delete button in source details renders delete form and deletes selected source', async () => {
    mockedServices.deleteSource.mockResolvedValue('Source testuser deleted!');

    const source = screen.getByText(/testname/);
    await userEvent.click(source);

    const deleteButton = screen.getByRole("button", { name: /delete source/i });
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);

    const deleteFormHeader = screen.getByText(/confirm database password to delete/i)
    expect(deleteFormHeader).toBeInTheDocument();

    const dbPasswordInput = screen.getByLabelText(/Database Password/i) as HTMLInputElement;
    expect(dbPasswordInput).toBeInTheDocument();
    await userEvent.type(dbPasswordInput, "testdbpassword");
    expect(dbPasswordInput.value).toBe('testdbpassword')
    
    const confirmDeleteButton = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(confirmDeleteButton);

    const deletedText = screen.getByText(/Source deleted successfully!/i);
    expect(deletedText).toBeInTheDocument();
  });
});
