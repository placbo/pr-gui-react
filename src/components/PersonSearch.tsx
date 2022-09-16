import SearchIcon from '@mui/icons-material/Search';
import { InputBase, Paper, Typography } from '@mui/material';
import PersonResultList from './PersonResultList';
import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Colors } from '../theme';
import axios from 'axios';
import { PERSONS_URL } from '../constants';
import _ from 'lodash';

const StyledSearchBox = styled.div`
  position: relative;
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.2);
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const StyledSearchIconWrapper = styled.div`
  padding: 0 1rem;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInputBase = styled(InputBase)`
  & input {
    padding: 0.7rem 1rem 0.7rem 3rem;
    width: 100%;
    color: white;
    font-weight: bold;
  }
`;

const ErrorText = styled(Typography)`
  color: #fc4445;
`;

const StyledPaper = styled(Paper)`
  position: absolute;
  top: 4.5rem;
  right: 0.5rem;
  max-height: 40rem;
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
          await axios.get(`${PERSONS_URL}?q=${event.target.value}`, {
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
        <StyledSearchIconWrapper>
          <SearchIcon />
        </StyledSearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleSearchTermChange}
          autoComplete="off"
        />
      </StyledSearchBox>

      {isSearching && <Typography variant="body1">Søker...</Typography>}
      {searchError && <ErrorText variant="body1">{searchError.message}</ErrorText>}
      {persons && persons.length > 0 && (
        <StyledPaper>
          <PersonResultList persons={persons} />
        </StyledPaper>
      )}
    </>
  );
};
