import { Alert, Button, CircularProgress, Paper, TextField } from '@mui/material';
import React, { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import styled from '@emotion/styled';
import { LOGIN_URL } from '../constants';
import axios from 'axios';
import { AuthContext } from '../App';

const StyledPageWrapper = styled(Container)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledFormWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;
const StyleLoginContentWrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

export const Login: FC = () => {
  const navigate = useNavigate();
  const { setIsUserLoggedIn } = useContext(AuthContext);

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const login = async () => {
    try {
      setIsLoading(true);
      setLoginError('');
      const result = await axios.post(LOGIN_URL, {
        password,
      });
      const fetchedToken = await result.data.token;
      if (fetchedToken) {
        setIsUserLoggedIn(fetchedToken);
        localStorage.setItem('token', fetchedToken);
        //todo: sjekk expiry
        navigate('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoginError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledPageWrapper>
      <StyleLoginContentWrapper>
        <StyledFormWrapper>
          <TextField
            id="passord"
            label="Passord"
            variant="standard"
            disabled={isLoading}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button variant="contained" disabled={isLoading} onClick={login}>
            Do it {isLoading && <CircularProgress size={'1rem'} />}
          </Button>
        </StyledFormWrapper>
        {loginError && <Alert severity="error">{loginError}</Alert>}
      </StyleLoginContentWrapper>
    </StyledPageWrapper>
  );
};
