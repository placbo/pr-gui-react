import { AppBar, Button, IconButton, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { FC, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';

// import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Colors, DeviceWidths } from '../theme';
import { Link, useNavigate } from 'react-router-dom';
import { PersonSearchDialog } from './PersonSearchDialog';
import EditIcon from '@mui/icons-material/Edit';

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  @media (max-width: ${DeviceWidths.sm}) {
    justify-content: flex-start;
  } ;
`;

const StyledExtraButtons: any = styled.div`
  @media (max-width: ${DeviceWidths.sm}) {
    display: none;
  } ;
`;

const StyledSeparator = styled.div`
  flex-grow: 1;
  @media (max-width: ${DeviceWidths.sm}) {
    margin-left: 1rem;
  } ;
`;

const StyledLink = styled(Link)`
  color: ${Colors.Background};
`;

export const Header: FC = () => {
  // const [isAddPersonDialogOpen, setIsAddPersonDialogOpen] = useState(false);
  // const [isAddCommunityDialogOpen, setIsAddCommunityDialogOpen] = useState(false);
  const [isSearchResultDialogOpen, setIsSearchResultDialogOpen] = useState(false);

  // const toggleAddPersonDialog = () => {
  //   setIsAddPersonDialogOpen(!isAddPersonDialogOpen);
  // };

  // const toggleAddCommunityDialog = () => {
  //   setIsAddCommunityDialogOpen(!isAddCommunityDialogOpen);
  // };

  const navigate = useNavigate();

  // handle shortcut keys
  const handleKeyPress = useCallback((event: any) => {
    if (event.ctrlKey && event.key === 'q') {
      setIsSearchResultDialogOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <header>
      <AppBar position="static">
        <StyledToolbar>
          <StyledLink to="/">
            <IconButton color="inherit" size="large">
              <HomeIcon />
            </IconButton>
          </StyledLink>
          <StyledLink to="/communities">
            <IconButton color="inherit" size="large">
              <GroupIcon />
            </IconButton>
          </StyledLink>
          <StyledLink to="/editperson">
            <IconButton color="inherit" size="large">
              <PersonAddIcon />
            </IconButton>
          </StyledLink>
          <StyledLink to="/admin">
            <IconButton color="inherit" size="large">
              <EditIcon />
            </IconButton>
          </StyledLink>
          <StyledExtraButtons>
            {/*<IconButton href="/person/1" color="inherit" size="large">*/}
            {/*  <AccessibilityNewIcon />*/}
            {/*</IconButton>*/}

            {/* <StyledLink to="/newperson">
              <IconButton color="inherit" size="large">
                <PersonAddIcon />
              </IconButton>
            </StyledLink> */}
            {/*<IconButton onClick={toggleAddCommunityDialog} color="inherit" size="large">*/}
            {/*  <GroupAddIcon />*/}
            {/*</IconButton>*/}
          </StyledExtraButtons>
          <StyledSeparator />
          <IconButton onClick={() => setIsSearchResultDialogOpen(true)} color="inherit" size="large">
            <SearchIcon />
          </IconButton>
          <Button
            style={{ color: 'black', backgroundColor: 'white' }}
            variant={'text'}
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Logg ut
          </Button>
        </StyledToolbar>
      </AppBar>
      <PersonSearchDialog isDialogOpen={isSearchResultDialogOpen} setIsDialogOpen={setIsSearchResultDialogOpen} />
    </header>
  );
};
