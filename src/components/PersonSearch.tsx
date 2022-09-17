import SearchIcon from '@mui/icons-material/Search';
import { Button, CircularProgress, InputBase, Paper, Typography } from '@mui/material';

import PersonResultList from './PersonResultList';
import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Colors } from '../theme';
import axios from 'axios';
import { PERSONS_URL } from '../constants';
import _ from 'lodash';
import { QUERY_PARAM, SORT_ASCENDING, SORT_DESCENDING, SORT_PARAM } from '../types/paramTypes';

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
  const [persons, setPersons] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<Error>();

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const getPersonsByQuery = async () => {
      try {
        setIsSearching(true);
        const result = (
          await axios.get(`${PERSONS_URL}?${QUERY_PARAM}=${event.target.value}`, {
            headers: {
              'X-Auth-Token': localStorage.getItem('token') ?? '',
            },
          })
        ).data;
        setPersons(result.persons);
      } catch (error: any) {
        setSearchError(error.message);
      } finally {
        setIsSearching(false);
      }
    };

    const getPersonsByQueryDebounced = _.debounce(getPersonsByQuery, 500);

    if (event.target.value.length > 2) {
      getPersonsByQueryDebounced();
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
        <LoadingIconWrapper>{isSearching && <CircularProgress color="inherit" size={'1rem'} />}</LoadingIconWrapper>
      </StyledSearchBox>
      {searchError && (
        <Typography color="red" variant="body1">
          {searchError.message}
        </Typography>
      )}
      {persons && persons.length > 0 && (
        <FloatingResultListContainer>
          <PersonResultList persons={persons} />
          <Button
            onClick={() => {
              setPersons([]); //todo: autoclose
            }}
          >
            Close
          </Button>
        </FloatingResultListContainer>
      )}
    </>
  );
};
