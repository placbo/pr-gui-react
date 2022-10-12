import { FC, useEffect, useState } from 'react';
import { Person } from '../types/person';
import { Alert, Box, Checkbox, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { TableToolbar } from '../components/TableToolbar';
import { deletePerson, getPersons } from '../api/api';
import { SelectCommunityDialog } from '../components/SelectCommunityDialog';
import { ErrorAlert } from '../components/ErrorAlert';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const AdminPage: FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [error, setError] = useState<string>('');
  const [checked, setChecked] = useState<string[]>([]);

  const [isWaiting, setIsWaiting] = useState(false);
  const [loadingPersonsError, setLoadingPersonsError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await getPersons(100, setLoadingPersonsError, setIsWaiting);
      setPersons(result.persons);
    };
    asyncFunc();
  }, []);

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

  const [isCommunityDialogOpen, setIsCommunityDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState<string>('');

  const handleAddCheckedToCommunity = (communityId: string | undefined) => {
    setIsCommunityDialogOpen(false);
    if (communityId) {
      checked.forEach((personId) => {
        console.log(`adding person: ${personId} to community:  ${communityId} `);
      });
    }
  };

  const handleDeleteCheckedfromCommunity = () => {
    setError('handleDeleteCheckedfromCommunity is not implemented yet');
  };

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  const handleDeletePersons = () => {
    setIsConfirmDialogOpen(true);
    setConfirmationText(`Sikker på at du vil slette ${checked.length} person(er)`);
  };

  const handleConfirmDeleted = async (shouldDelete: boolean) => {
    setIsConfirmDialogOpen(false);
    if (shouldDelete) {
      await Promise.all(
        checked.map(async (personId) => {
          await deletePerson(personId);
        })
      );
      //todo: result kalles for fort - timeout blir for dumt, da. prøv med for .. in
      setTimeout(async () => {
        setChecked([]);
        const result = await getPersons(100, setLoadingPersonsError, setIsWaiting);
        setPersons(result.persons);
      }, 500);
    }
  };

  return (
    <>
      {isWaiting && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingPersonsError && <ErrorAlert errorMessage={loadingPersonsError.message}></ErrorAlert>}
      <Box sx={{ width: '100%' }}>
        <TableToolbar
          numSelected={checked.length}
          setIsCommunityDialogOpen={setIsCommunityDialogOpen}
          handleDeletePersons={handleDeletePersons}
          handleDeleteCheckedfromCommunity={handleDeleteCheckedfromCommunity}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <List
          dense
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          {persons.map((person: Person) => {
            const labelId = `checkbox-person-${person.id}`;
            return (
              <ListItem key={person.id} disablePadding>
                <ListItemIcon>
                  <Checkbox
                    onChange={handleToggle(person.id)}
                    edge="start"
                    checked={checked.indexOf(person.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={[person.lastName, person.firstName].filter(Boolean).join(', ')} />
              </ListItem>
            );
          })}
        </List>
      </Box>
      <SelectCommunityDialog open={isCommunityDialogOpen} onClose={handleAddCheckedToCommunity} />
      <ConfirmDialog open={isConfirmDialogOpen} text={confirmationText} handleConfirm={handleConfirmDeleted} />
    </>
  );
};
