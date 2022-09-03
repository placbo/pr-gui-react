import { FC, useEffect, useState } from 'react';
import { StyleWidths } from '../theme';
import PersonResultGrid from '../components/PersonResultGrid';
import styled from '@emotion/styled';
import HeadingWithLine from '../components/HeadingWithLine';
import axios from 'axios';
import { PERSONS_URL } from '../constants';

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
  const [persons, setpersons] = useState<any>([]);

  useEffect(() => {
    const asyncAxiosFunction = async () => {
      const result = await axios.get(PERSONS_URL, {
        headers: {
          'X-Auth-Token': localStorage.getItem('token') ?? '',
        },
      });
      console.log(result.data.data.length);

      setpersons(result.data.data);
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
