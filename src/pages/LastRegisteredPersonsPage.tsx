import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import styled from '@emotion/styled';
import axios from 'axios';

import HeadingWithLine from '../components/HeadingWithLine';
import { PersonResultGrid } from '../components/PersonResultGrid';
import { PERSONS_URL } from '../constants';
import { StyleWidths } from '../theme';
import { Person } from '../types/person';
import {
  DEFAULT_NUMBER_OF_RESULTS,
  NUMBER_PR_PAGE_PARAM,
  PAGE_PARAM,
  SORT_DESCENDING,
  SORT_PARAM,
} from '../types/QueryParams';


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
  const [searchParams] = useSearchParams();
  const numberPrPage = searchParams.get('max') || DEFAULT_NUMBER_OF_RESULTS;

  const [persons, setPersons] = useState<Person[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const getPersons = async () => {
      const result = (
        await axios.get(
          `${PERSONS_URL}?${PAGE_PARAM}=${page}&${SORT_PARAM}=${SORT_DESCENDING}&${NUMBER_PR_PAGE_PARAM}=${numberPrPage}`,
          {
            headers: {
              'X-Auth-Token': localStorage.getItem('token') ?? '',
            },
          }
        )
      ).data;
      setPersons((prevState) => {
        return [...prevState, ...result.persons];
      });
    };
    getPersons();
  }, [page, numberPrPage]);

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
