import { FC, useState } from 'react';

import styled from '@emotion/styled';

import { AddNewPersonComponent } from '../components/AddNewPersonComponent';
import HeadingWithLine from '../components/HeadingWithLine';
import { StyleWidths } from '../theme';
import { emptyPerson, Person } from '../types/person';

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${StyleWidths.content};
  flex-grow: 1;
  width: 100%;
  margin-top: 1rem;
`;

export const NewNewPersonsPage: FC = () => {
  const [persons, setPersons] = useState<Person[]>([emptyPerson]); //todo: use this for editing as well

  const addNewPersonFormToPage = () => {
    setPersons((prevState) => [...prevState, emptyPerson]);
  };

  return (
    <StyledLayout>
      <HeadingWithLine text="Legg til personer"></HeadingWithLine>
      {persons.map((_person, index) => (
        <AddNewPersonComponent key={index} addNewPersonFormToPage={addNewPersonFormToPage} />
      ))}
    </StyledLayout>
  );
};
