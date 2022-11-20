import { FC, useEffect, useState } from 'react';
import { useNavigate , Route, Routes } from 'react-router-dom';

import styled from '@emotion/styled';
import { Container, Typography } from '@mui/material';

import { Header } from '../components/Header';
import { USE_MOCK_DATA } from '../constants';
import { Colors } from '../theme';
import { AdminPage } from './AdminPage';
import { CommunitiesPage } from './CommunitiesPage';
import { CommunityPage } from './CommunityPage';
import { EditCommunityPage } from './EditCommunityPage';
import { EditPersonPage } from './EditPersonPage';
import { LastRegisteredPersonsPage } from './LastRegisteredPersonsPage';
import { NewNewPersonsPage } from './NewNewPersonsPage';
import { NotFoundPage } from './NotFoundPage';
import { PersonGamePage } from './PersonGamePage';
import { PersonPage } from './PersonPage';

const App = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-between;
`;

const Content = styled(Container)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
`;

const Footer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 4rem;
  background-color: ${Colors.FaintBlue};
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
    if ((!token || isTokenExpired(tokenExpiry)) && !USE_MOCK_DATA) {
      return navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  return isloggedIn ? (
    <App>
      <Header />
      <Content>
        <Routes>
          <Route path="/" element={<LastRegisteredPersonsPage />} />
          <Route path="/person/:identifier" element={<PersonPage />} />
          <Route path="/editperson/:personId" element={<EditPersonPage />} />
          <Route path="/editcommunity/:communityId" element={<EditCommunityPage />} />
          <Route path="/editcommunity" element={<EditCommunityPage />} />
          <Route path="/newpersons" element={<NewNewPersonsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/game" element={<PersonGamePage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:identifier" element={<CommunityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
      <Footer>
        <Typography>Token expires: {tokenExpiresString}</Typography>
      </Footer>
    </App>
  ) : (
    <div></div>
  );
};
