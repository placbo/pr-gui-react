import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import styled from '@emotion/styled';
import { Persons } from './Persons';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-flow: column nowrap;
  align-items: stretch;
`;

const StyledContent = styled(Container)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const isTokenExpired = (token: string) => {
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  console.log('Token expires: ', new Date(expiry * 1000).toLocaleString());
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const [isloggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      return navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  return isloggedIn ? (
    <StyledApp>
      <Button
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      >
        Logg ut
      </Button>
      <StyledContent>
        <h1>Homepage logget inn: {isloggedIn}</h1>
        <Persons></Persons>
      </StyledContent>
    </StyledApp>
  ) : (
    <div></div>
  );
};
