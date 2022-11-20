import { FC } from 'react';

import styled from '@emotion/styled';

import { CommunityResultGrid } from '../components/CommunityResultGrid';

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
