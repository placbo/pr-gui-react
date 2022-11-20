import { FC } from 'react';

import styled from '@emotion/styled';
import { Button } from '@mui/material';

import PersonCard from '../components/PersonCard';
import { DeviceWidths } from '../theme';
import { Person } from '../types/person';

const StyledResultList = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${DeviceWidths.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const PersonResultGrid: FC<{ persons: Person[]; fetchMorePersons?: () => void }> = ({
  persons,
  fetchMorePersons,
}) => {
  /*
  const sortedPersons = persons.sort((a, b) =>
    (a.lastName?.toUpperCase() ?? '') > (b.lastName?.toUpperCase() ?? '')
      ? 1
      : (a.lastName?.toUpperCase() ?? '') === (b.lastName?.toUpperCase() ?? '')
      ? (a.firstName?.toUpperCase() ?? '') > (b.firstName?.toUpperCase() ?? '')
        ? 1
        : -1
      : -1
  );
  */

  return (
    <StyledResultList>
      {persons && persons.map((person: Person) => <PersonCard person={person} key={person.id}></PersonCard>)}
      {fetchMorePersons && <Button onClick={fetchMorePersons}>mer...</Button>}
    </StyledResultList>
  );
};
