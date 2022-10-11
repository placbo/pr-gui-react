import { Alert, AlertTitle } from '@mui/material';
import { FC } from 'react';
import styled from '@emotion/styled';

const StyledAlert = styled(Alert)`
  margin-top: 2rem;
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
