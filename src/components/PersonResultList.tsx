import { Avatar, Button, Typography } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Person } from '../types/person';
import { IMAGE_BASE_URL } from '../resources/constants';

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

const PersonResultList: FC<{ persons: Person[] }> = ({ persons }) => {
  return (
    <StyledResultList>
      {persons.map((person: Person) => (
        <StyledResultListItem key={person.id}>
          <StyledButton href={`/person/${person.id}`}>
            <Avatar src={`${IMAGE_BASE_URL}/persons/thumbs/thumbnail.${person.imageName}`} />
            <StyledResultListName variant="body1">
              {[person.lastName, person.firstName].filter(Boolean).join(', ')}
            </StyledResultListName>
          </StyledButton>
        </StyledResultListItem>
      ))}
    </StyledResultList>
  );
};

export default PersonResultList;
