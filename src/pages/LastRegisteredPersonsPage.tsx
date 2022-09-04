import { FC, useEffect, useState } from 'react';
import { StyleWidths } from '../theme';
import PersonResultGrid from '../components/PersonResultGrid';
import styled from '@emotion/styled';
import HeadingWithLine from '../components/HeadingWithLine';
import axios from 'axios';
import { PERSONS_URL } from '../constants';
import { Person } from '../types/person';

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${StyleWidths.content};
  flex-grow: 1;
  width: 100%;
  margin-top: 1rem;
`;

export const LastRegisteredPersonsPage: FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const asyncAxiosFunction = async () => {
      const result = (
        await axios.get(PERSONS_URL, {
          headers: {
            'X-Auth-Token': localStorage.getItem('token') ?? '',
          },
        })
      ).data;
      setPersons(result.persons);
    };
    asyncAxiosFunction();
  }, []);

  return (
    <StyledLayout>
      <HeadingWithLine text="Sist registrerte"></HeadingWithLine>
      {persons && <PersonResultGrid persons={persons} />}
    </StyledLayout>
  );
};
