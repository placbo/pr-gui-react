import { FC } from 'react';
import { CommunityResultGrid } from '../components/CommunityResultGrid';
import HeadingWithLine from '../components/HeadingWithLine';
import styled from '@emotion/styled';

const StyledPage = styled.div`
  max-width: 60rem;
  margin-top: 1rem;
  width: 100%;
`;

export const CommunitiesPage: FC = () => {
  return (
    <StyledPage>
      <HeadingWithLine text="Alle grupper"></HeadingWithLine>
      <CommunityResultGrid />
    </StyledPage>
  );
};
