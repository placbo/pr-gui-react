import { FC } from 'react';

import styled from '@emotion/styled';
import { Alert, AlertTitle } from '@mui/material';

const StyledAlert = styled(Alert)`
  width: 100%;
`;

interface Props {
  errorMessage: string;
}

export const ErrorAlert: FC<Props> = ({ errorMessage }) => {
  return (
    <StyledAlert severity="error">
      <AlertTitle>En feil har oppstått!</AlertTitle>
      {errorMessage}
    </StyledAlert>
  );
};
