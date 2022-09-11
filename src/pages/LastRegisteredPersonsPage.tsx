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
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const asyncAxiosFunction = async () => {
      const result = (
        await axios.get(PERSONS_URL + '?page=' + page, {
          headers: {
            'X-Auth-Token': localStorage.getItem('token') ?? '',
          },
        })
      ).data;
      setPersons((prevState) => {
        console.log(prevState);
        return [...prevState, ...result.persons];
      });
    };
    asyncAxiosFunction();
  }, [page]);

  const triggerNextPageFetch = () => {
    setPage((prevState: number) => prevState + 1);
  };

  return (
    <StyledLayout>
      <HeadingWithLine text="Sist registrerte"></HeadingWithLine>
      {persons && <PersonResultGrid persons={persons} fetchMorePersons={triggerNextPageFetch} />}
    </StyledLayout>
  );
};
