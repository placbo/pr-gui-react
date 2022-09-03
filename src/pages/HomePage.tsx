import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { Container } from '@mui/material';
import styled from '@emotion/styled';
import { Header } from '../components/Header';
import { Route, Routes } from 'react-router-dom';
import { PersonPage } from './PersonPage';
import { NotFoundPage } from './NotFoundPage';
import { LastRegisteredPersonsPage } from './LastRegisteredPersonsPage';

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

const getTokenExpiry = (token: string | null): number => {
  if (!token) return 0;
  return JSON.parse(atob(token.split('.')[1])).exp;
};

const isTokenExpired = (expiry: number): boolean => {
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpiresString, setTokenExpiresString] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = getTokenExpiry(token);
    setTokenExpiresString(new Date(tokenExpiry * 1000).toLocaleTimeString());
    if (!token || isTokenExpired(tokenExpiry)) {
      return navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  return isloggedIn ? (
    <StyledApp>
      <Header infoText={tokenExpiresString} />
      <StyledContent>
        <Routes>
          <Route path="/" element={<LastRegisteredPersonsPage />} />
          <Route path="/person/:identifier" element={<PersonPage />} />
          {/* <Route path="/newperson" element={<NewUser />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/addimage" element={<AddImage />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </StyledContent>
    </StyledApp>
  ) : (
    <div></div>
  );
};
