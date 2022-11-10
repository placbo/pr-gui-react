import { Dialog, Button, DialogContent, DialogActions } from '@mui/material';

interface Props {
  open: boolean;
  text: string;
  handleConfirm: (value: boolean) => void;
}

export const ConfirmDialog = (props: Props) => {
  const { open, text, handleConfirm } = props;

  return (
    <Dialog onClose={() => handleConfirm(false)} open={open}>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => handleConfirm(false)}>
          Nei, takk
        </Button>
        <Button variant="contained" onClick={() => handleConfirm(true)}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
};
