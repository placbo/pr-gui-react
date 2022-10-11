import { FC } from 'react';
import { StyleWidths } from '../theme';
import styled from '@emotion/styled';
import HeadingWithLine from '../components/HeadingWithLine';
import { AddNewPersonComponent } from '../components/AddNewPersonComponent';

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
  return (
    <StyledLayout>
      <HeadingWithLine text="Legg til personer"></HeadingWithLine>
      <AddNewPersonComponent />
    </StyledLayout>
  );
};
