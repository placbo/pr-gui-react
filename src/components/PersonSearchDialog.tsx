import { FC, useState, ChangeEvent } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, Dialog, DialogContent, InputAdornment, List, TextField } from '@mui/material';
import _ from 'lodash';

import { usePersonsQuery } from '../api/api';
import { ErrorAlert } from './ErrorAlert';
import { PersonResultList } from './PersonResultList';

export interface props {
  isDialogOpen: boolean;
  setIsDialogOpen: any;
}

export const PersonSearchDialog: FC<props> = ({ isDialogOpen, setIsDialogOpen }) => {
  const [searchTerm, setSearchTerm] = useState<null | string>(null);
  const { persons, isLoading, loadingError } = usePersonsQuery(searchTerm);

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    const setSearchTermDebounced = _.debounce(() => setSearchTerm(event.target.value), 500);
    if (event.target.value.length > 2) {
      setSearchTermDebounced();
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleClose} fullWidth PaperProps={{ sx: { minHeight: '90%' } }}>
      <DialogContent>
        <List>
          <TextField
            focused
            autoFocus
            fullWidth
            placeholder="Search..."
            onChange={handleSearchTermChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </List>
        {isLoading && <CircularProgress color="inherit" size={'2rem'} />}
        {loadingError && <ErrorAlert errorMessage={loadingError.message}></ErrorAlert>}
        {persons && persons.length > 0 && <PersonResultList persons={persons} handleClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
};
