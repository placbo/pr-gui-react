import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import {
  deletePerson,
  getPersons,
  addPersonToCommunity,
  getPersonsInCommunity,
  removePersonFromCommunity,
} from '../api/api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorAlert } from '../components/ErrorAlert';
import { SelectCommunityDialog } from '../components/SelectCommunityDialog';
import { TableToolbar } from '../components/TableToolbar';
import { PERSON_THUMBNAIL_URL } from '../constants';
import { Community } from '../types/community';
import { Person } from '../types/person';

const HideOnMobile = styled.span`
  @media (max-width: 640px) {
    display: none;
  }
`;

export const AdminPage: FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [error, setError] = useState<string>('');
  const [checked, setChecked] = useState<string[]>([]);

  const [isWaiting, setIsWaiting] = useState(false);
  const [loadingPersonsError, setLoadingPersonsError] = useState<Error | undefined>(undefined);

  const [communityFilter, setcommunityFilter] = useState<Community[]>([]);
  const [isAddToCommunityDialogOpen, setIsAddToCommunityDialogOpen] = useState(false);
  const [isFilterByCommunityDialogOpen, setIsFilterByCommunityDialogOpen] = useState(false);
  const [isRemoveCommunityDialogOpen, setIsRemoveCommunityDialogOpen] = useState(false);

  const [confirmationText, setConfirmationText] = useState<string>('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await getPersons(100, true, setLoadingPersonsError, setIsWaiting);
      setPersons(result.persons);
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    const asyncFunc = async () => {
      if (communityFilter.length > 0) {
        const result = await getPersonsInCommunity(communityFilter[0].id, true, setLoadingPersonsError, setIsWaiting); //TODO:støtte for flere gruppe-filter
        setPersons(result);
      } else {
        const result = await getPersons(100, true, setLoadingPersonsError, setIsWaiting);
        setPersons(result.persons);
      }
    };
    asyncFunc();
  }, [communityFilter]);

  const handleToggle = (personId: string) => () => {
    setError('');
    const currentIndex = checked.indexOf(personId);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(personId);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAddCommunityFilter = (communityId?: string, name?: string) => {
    setIsFilterByCommunityDialogOpen(false);
    communityId && name && setcommunityFilter((prevValue) => [...prevValue, { id: communityId, name: name }]);
  };

  const handleAddCheckedToCommunity = (communityId?: string) => {
    setIsAddToCommunityDialogOpen(false);
    setError('');
    if (communityId) {
      checked.forEach(async (personId) => {
        await addPersonToCommunity(personId, communityId, error, setIsWaiting);
        //TODO: vis aggregerte resultater (2 positive og en negativ f.ex ?)
      });
      setTimeout(async () => {
        reloadResults();
      }, 500);
    }
  };

  const handleRemoveCheckedFromCommunity = (communityId?: string) => {
    setIsRemoveCommunityDialogOpen(false);
    setError('');
    if (communityId) {
      checked.forEach(async (personId) => {
        await removePersonFromCommunity(personId, communityId, error, setIsWaiting);
        //TODO: vis aggregerte resultater (2 positive og en negativ f.ex ?)
      });
      setTimeout(async () => {
        reloadResults();
      }, 500);
    }
  };

  const handleDeletePersons = () => {
    setIsConfirmDialogOpen(true);
    setConfirmationText(`Sikker på at du vil slette ${checked.length} person(er)`);
  };

  const reloadResults = async () => {
    setChecked([]);
    if (communityFilter.length > 0) {
      const result = await getPersonsInCommunity(communityFilter[0].id, true, setLoadingPersonsError, setIsWaiting); //TODO:støtte for flere gruppe-filter
      setPersons(result);
    } else {
      const result = await getPersons(100, true, setLoadingPersonsError, setIsWaiting);
      setPersons(result.persons);
    }
  };

  const handleConfirmDelete = async (shouldDelete: boolean) => {
    setIsConfirmDialogOpen(false);
    if (shouldDelete) {
      await Promise.all(
        checked.map(async (personId) => {
          await deletePerson(personId);
        })
      );
      //todo: result kalles for fort - timeout blir for dumt, da. prøv med for .. in
      setTimeout(async () => {
        reloadResults();
      }, 500);
    }
  };

  const handleRemoveFilter = (communityid: string) => {
    setcommunityFilter((prevValue) => prevValue.filter((community) => community.id !== communityid));
  };

  return (
    <>
      {isWaiting && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingPersonsError && <ErrorAlert errorMessage={loadingPersonsError.message}></ErrorAlert>}
      <Box sx={{ width: '100%', maxWidth: '40rem' }}>
        <TableToolbar
          numSelected={checked.length}
          setIsAddToCommunityDialogOpen={setIsAddToCommunityDialogOpen}
          handleDeletePersons={handleDeletePersons}
          setIsRemoveCommunityDialogOpen={setIsRemoveCommunityDialogOpen}
        />
        {error && <Alert severity="error">{error}</Alert>}

        {communityFilter.length > 0 ? (
          <div>
            {communityFilter.map((community, index) => (
              <Chip key={index} label={community.name} onDelete={() => handleRemoveFilter(community.id)}></Chip>
            ))}
          </div>
        ) : (
          <Button onClick={() => setIsFilterByCommunityDialogOpen(true)}>Filtrer på gruppe</Button>
        )}
        <List
          dense
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          {persons &&
            persons.map((person: Person) => {
              const labelId = `checkbox-person-${person.id}`;
              return (
                <ListItem
                  key={person.id}
                  disablePadding
                  secondaryAction={
                    <Checkbox
                      onChange={handleToggle(person.id)}
                      edge="start"
                      checked={checked.indexOf(person.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  }
                >
                  <ListItemButton
                    component={Link}
                    to={`/person/${person.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ListItemAvatar>
                      <Avatar alt={person.lastName} src={`${PERSON_THUMBNAIL_URL}${person.imageName}`} />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={
                        <>
                          {[person.lastName, person.firstName].filter(Boolean).join(', ')}
                          <HideOnMobile>
                            {person.communities?.map((community, index) => (
                              <Chip key={index} size="small" variant="outlined" label={community.name} sx={{ ml: 1 }} />
                            ))}
                          </HideOnMobile>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </Box>
      <SelectCommunityDialog open={isAddToCommunityDialogOpen} onClose={handleAddCheckedToCommunity} />
      <SelectCommunityDialog open={isFilterByCommunityDialogOpen} onClose={handleAddCommunityFilter} />
      <SelectCommunityDialog open={isRemoveCommunityDialogOpen} onClose={handleRemoveCheckedFromCommunity} />
      <ConfirmDialog open={isConfirmDialogOpen} text={confirmationText} handleConfirm={handleConfirmDelete} />
    </>
  );
};
