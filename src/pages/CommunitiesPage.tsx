import { FC } from 'react';
import { CommunityResultGrid } from '../components/CommunityResultGrid';
import styled from '@emotion/styled';

const StyledPage = styled.div`
  max-width: 60rem;
  margin-top: 1rem;
  width: 100%;
`;

export const CommunitiesPage: FC = () => {
  return (
    <StyledPage>
      <CommunityResultGrid />
    </StyledPage>
  );
};
