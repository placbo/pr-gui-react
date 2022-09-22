import { CircularProgress, Dialog, DialogContent, InputAdornment, List, TextField, Typography } from '@mui/material';

import PersonResultList from './PersonResultList';
import React, { FC, useState } from 'react';
import _ from 'lodash';
import { usePersonsQuery } from './api';
import { Person } from '../types/person';
import SearchIcon from '@mui/icons-material/Search';

export interface SimpleDialogProps {
  open: boolean;
  persons: Person[];
  setOpen: any;
}

export interface props {
  isDialogOpen: boolean;
  setIsDialogOpen: any;
}

export const PersonSearchDialog: FC<props> = ({ isDialogOpen, setIsDialogOpen }) => {
  const [searchTerm, setSearchTerm] = useState<null | string>(null);
  const { persons, isLoading, loadingError } = usePersonsQuery(searchTerm);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const setSearchTermDebounced = _.debounce(() => setSearchTerm(event.target.value), 500);
    if (event.target.value.length > 2) {
      setSearchTermDebounced();
    }
  };

  const handleClose = () => {
    setSearchTerm('');
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
        {loadingError && (
          <Typography color="red" variant="body1">
            {loadingError.message}
          </Typography>
        )}
        {persons && persons.length > 0 && <PersonResultList persons={persons} handleClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
};
