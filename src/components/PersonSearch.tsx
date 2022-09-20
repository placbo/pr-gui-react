import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, InputBase, Paper, Typography } from '@mui/material';

import PersonResultList from './PersonResultList';
import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Colors } from '../theme';
import _ from 'lodash';
import { usePersonsQuery } from './api';

const StyledSearchBox = styled.div`
  display: flex;
  padding: 0.5rem;
  width: 10rem;
  flex-direction: row;
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.2);
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  align-items: center;
`;

const LoadingIconWrapper = styled.div`
  width: 1.5rem;
`;

const StyledInputBase = styled(InputBase)`
  & input {
    padding: 0 0.7rem;
    color: white;
  }
`;

const FloatingResultListContainer = styled(Paper)`
  position: absolute;
  top: 4.5rem;
  right: 0.5rem;
  width: 20rem;
  overflow: hidden;
  z-index: 2;
  border: 1px solid ${Colors.SecondaryText};
`;

export const PersonSearch: FC = () => {
  const [searchTerm, setSearchTerm] = useState<null | string>(null);
  const { persons, isLoading, loadingError } = usePersonsQuery(searchTerm);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const setSearchTermDebounced = _.debounce(() => setSearchTerm(event.target.value), 500);
    if (event.target.value.length > 2) {
      setSearchTermDebounced();
    }
  };

  return (
    <>
      <StyledSearchBox>
        <SearchIcon />
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleSearchTermChange}
          autoComplete="off"
        />
        <LoadingIconWrapper>{isLoading && <CircularProgress color="inherit" size={'1rem'} />}</LoadingIconWrapper>
      </StyledSearchBox>
      {loadingError && (
        <Typography color="red" variant="body1">
          {loadingError.message}
        </Typography>
      )}
      {persons && persons.length > 0 && (
        <FloatingResultListContainer>
          <PersonResultList persons={persons} />
        </FloatingResultListContainer>
      )}
    </>
  );
};
