import { Typography } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Colors } from '../theme';

const StyledHeaderWithLine = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  color: ${Colors.SecondaryText};
`;

const StyledLine = styled.div`
  flex-grow: 1;
  height: 0.3rem;
  border-bottom: 1px solid ${Colors.SecondaryText};
  margin-left: 1rem;
`;

const HeadingWithLine: FC<{ text: string }> = ({ text }) => {
  return (
    <StyledHeaderWithLine>
      <Typography variant="h5" component="h1">
        {text}
      </Typography>
      <StyledLine />
    </StyledHeaderWithLine>
  );
};

export default HeadingWithLine;
