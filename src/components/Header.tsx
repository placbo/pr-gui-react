import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import MenuIcon from '@mui/icons-material/Menu';

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  @media (max-width: ${DeviceWidths.sm}) {
    justify-content: flex-start;
  } ;
`;

const Promp: any = styled.div`
  @media (min-width: ${DeviceWidths.sm}) {
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

const HiddenContentOnSmallScreen: any = styled.div`
  @media (max-width: ${DeviceWidths.sm}) {
    display: none;
  } ;
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

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //TODO: lag egen komponent for drawer
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Meny
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Hjem" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/communities">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Grupper" />
          </ListItemButton>
        </ListItem>{' '}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin">
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItemButton>
        </ListItem>{' '}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/newpersons">
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Ny person" />
          </ListItemButton>
        </ListItem>{' '}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/game">
            <ListItemIcon>
              <HelpCenterIcon />
            </ListItemIcon>
            <ListItemText primary="Memory" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  //TODO: appbar with drawer : https://mui.com/material-ui/react-app-bar/
  //TODO : Speed dial for adding new person ???
  return (
    <header>
      <AppBar position="static">
        <StyledToolbar>
          <Promp>
            <IconButton
              onClick={handleDrawerToggle}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Promp>
          <HiddenContentOnSmallScreen>
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

            <StyledLink to="/admin">
              <IconButton color="inherit" size="large">
                <FormatListBulletedIcon />
              </IconButton>
            </StyledLink>

            <StyledLink to="/newpersons">
              <IconButton color="inherit" size="large">
                <PersonAddIcon />
              </IconButton>
            </StyledLink>

            <StyledLink to="/game">
              <IconButton color="inherit" size="large">
                <HelpCenterIcon />
              </IconButton>
            </StyledLink>
          </HiddenContentOnSmallScreen>
          <>
            {/*<IconButton onClick={toggleAddCommunityDialog} color="inherit" size="large">*/}
            {/*  <GroupAddIcon />*/}
            {/*</IconButton>*/}
          </>
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
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '20rem' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <PersonSearchDialog isDialogOpen={isSearchResultDialogOpen} setIsDialogOpen={setIsSearchResultDialogOpen} />
    </header>
  );
};
