import { Fade, Snackbar, SnackbarContent, IconButton } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { SuccessSnackProps } from "../types/types";
import { useState } from 'react';

interface SuccessStateProps {
  open: boolean;
  vertical: 'top' | 'bottom';
  horizontal: 'center' | 'left' | 'right';
  Transition: typeof Fade;
  handleCloseSnackbar: () => void;
}

export const SuccessSnack = ({ message, handleCloseSnackbar, openStatus }: SuccessSnackProps) => {
  const [state, setState] = useState<SuccessStateProps>({
    open: openStatus,
    vertical: 'top',
    horizontal: 'center',
    Transition: Fade,
    handleCloseSnackbar: handleCloseSnackbar,
  });

  const closeSnackbar = (e?: React.SyntheticEvent | Event, reason?: string) => {
    e?.preventDefault();
    if (reason === 'escapeKeyDown' || reason === 'clickaway' || reason === 'iconClick') {
      setState({ ...state, open: false });
      handleCloseSnackbar();
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }}
        open={state.open}
        TransitionComponent={state.Transition}
        onClose={handleCloseSnackbar}
        key={state.vertical + state.horizontal}
      >
        <SnackbarContent
          message={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutline fontSize="small" style={{ marginRight: '8px', color: 'green' }} />
              {message}
            </span>
          }
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => closeSnackbar(undefined, 'iconClick')}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </div>
  );
};
