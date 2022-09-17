import { Avatar, Button, Typography } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Person } from '../types/person';
import { Link } from 'react-router-dom';
import { PERSON_THUMBNAIL_URL } from '../constants';

const StyledResultList = styled.ul`
  padding: 0.5rem;
  margin-top: 1rem;
`;

const StyledResultListItem = styled.li`
  list-style: none;
`;

const StyledResultListName = styled(Typography)`
  display: inline-block;
  padding-left: 1rem;
`;

const StyledButton = styled(Button)`
  width: 100%;
  text-align: left;

  & .MuiButton-label {
    justify-content: start;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const PersonResultList: FC<{ persons: Person[] }> = ({ persons }) => {
  return (
    <StyledResultList>
      {persons.map((person: Person) => (
        <StyledResultListItem key={person.id}>
          <StyledLink to={`/person/${person.id}`}>
            <StyledButton>
              <Avatar src={`${PERSON_THUMBNAIL_URL}${person.imageName}`} />
              <StyledResultListName variant="body1">
                {[person.lastName, person.firstName].filter(Boolean).join(', ')}
              </StyledResultListName>
            </StyledButton>
          </StyledLink>
        </StyledResultListItem>
      ))}
    </StyledResultList>
  );
};

export default PersonResultList;
