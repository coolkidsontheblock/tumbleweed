import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SourceForm } from "../SourceForm";
import { textFieldTheme } from "../../styles/Theme";
import { ThemeProvider } from "@emotion/react";
import { ErrorSnack } from "../ErrorSnack";
import { createSource } from "../../services/sourcesService";

vi.mock("../../services/sourcesService");

const mockedServices = vi.mocked({
  createSource
}, true);

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

afterEach(() => {
  vi.resetAllMocks();
});

describe('Testing SourceForm component', async () => {
  it('Renders source form fields', async () => {
    render(
    <ThemeProvider theme={textFieldTheme}>
      <SourceForm
        setSources={vi.fn()}
        setOpenSourceForm={vi.fn()}
        openSourceForm={true}
        setError={vi.fn()}
        setErrorMsg={vi.fn()}
        setSuccess={vi.fn()}
        setSuccessMsg={vi.fn()}
        setPage={vi.fn()}
      />
    </ThemeProvider>
    );

    expect(screen.getByText(/Connect a new source database/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Connector Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database Hostname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database Port/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database Server Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Topics/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('Displays error message when required fields are missing', async () => {
    render(
      <ThemeProvider theme={textFieldTheme}>
        <SourceForm
          setSources={vi.fn()}
          setOpenSourceForm={vi.fn()}
          openSourceForm={true}
          setError={vi.fn()}
          setErrorMsg={vi.fn()}
          setSuccess={vi.fn()}
          setSuccessMsg={vi.fn()}
          setPage={vi.fn()}
        />
        <ErrorSnack
          message={"Missing input. All fields are required"}
          handleCloseSnackbar={vi.fn()}
          openStatus={true}
        />
      </ThemeProvider>
    );

    const connectButton = screen.getByRole('button', { name: /Connect/i });
    userEvent.click(connectButton);

    const missingText = screen.getByText(/Missing input. All fields are required/i);
    expect(missingText).toBeInTheDocument();
  });

  it('closes the modal when cancel button is clicked', async () => {
    const mockSetOpenSourceForm = vi.fn();

    render(
      <ThemeProvider theme={textFieldTheme}>
        <SourceForm
          setSources={vi.fn()}
          setOpenSourceForm={mockSetOpenSourceForm}
          openSourceForm={true}
          setError={vi.fn()}
          setErrorMsg={vi.fn()}
          setSuccess={vi.fn()}
          setSuccessMsg={vi.fn()}
          setPage={vi.fn()}
        />
      </ThemeProvider>
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
  
    await waitFor(() => {
      expect(mockSetOpenSourceForm).toHaveBeenCalledWith(false);
    })
  });

  it('Creating new source returns correct information', async () => {
    mockedServices.createSource.mockResolvedValue(mockSourceData);
    const mockSetOpenForm = vi.fn();
    const mockSuccess = vi.fn();
    const mockSetSuccessMsg = vi.fn();
    
    render(
      <ThemeProvider theme={textFieldTheme}>
        <SourceForm
          setSources={vi.fn()}
          setOpenSourceForm={mockSetOpenForm}
          openSourceForm={true}
          setError={vi.fn()}
          setErrorMsg={vi.fn()}
          setSuccess={mockSuccess}
          setSuccessMsg={mockSetSuccessMsg}
          setPage={vi.fn()}
        />
      </ThemeProvider>
    );

    const nameInput = screen.getByLabelText(/Connector Name/i);
    const dbHostnameInput = screen.getByLabelText(/Database Hostname/i);
    const dbPortInput = screen.getByLabelText(/Database Port/i);
    const dbNameInput = screen.getByLabelText(/Database Name/i);
    const dbServerNameInput = screen.getByLabelText(/Database Server Name/i);
    const dbUserNameInput = screen.getByLabelText(/Database Username/i);
    const dbPasswordInput = screen.getByLabelText(/Database Password/i);
    const topicsInput = screen.getByLabelText(/Topics/i);

    await userEvent.type(nameInput, 'testname');
    await userEvent.type(dbHostnameInput, 'testdbhostname');
    await userEvent.type(dbPortInput, '5432');
    await userEvent.type(dbNameInput, 'testdbname');
    await userEvent.type(dbServerNameInput, 'testdbservername');
    await userEvent.type(dbUserNameInput, 'testdbuser');
    await userEvent.type(dbPasswordInput, "testdbpassword");
    await userEvent.type(topicsInput, "products");

    const connectButton = screen.getByRole('button', { name: /Connect/i });
    await userEvent.click(connectButton);

    await waitFor(() => {
      expect(mockSetOpenForm).toHaveBeenCalledWith(false);
      expect(mockSuccess).toHaveBeenCalledWith(true);
      expect(mockSetSuccessMsg).toHaveBeenCalledWith("Source created successfully!");
    });
  });
});
