import { Dialog, DialogTitle, Button, DialogContent } from '@mui/material';

interface Props {
  open: boolean;
  onClose: (value: string | undefined) => void;
}

export function SelectCommunityDialog(props: Props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(undefined);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Velg gruppe</DialogTitle>
      <DialogContent>
        <Button variant="contained" onClick={() => handleListItemClick('123')}>
          velg
        </Button>
      </DialogContent>
    </Dialog>
  );
}
