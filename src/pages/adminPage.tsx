import { FC, useEffect, useState } from 'react';
import { Person } from '../types/person';
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { TableToolbar } from '../components/TableToolbar';
import { getPersons } from '../components/api';
import { SelectCommunityDialog } from '../components/SelectCommunityDialog';

export const AdminPage: FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [error, setError] = useState<string>('');
  const [checked, setChecked] = useState<string[]>([]);

  const [isLoadingPersons, setIsLoadingPersons] = useState(false);
  const [loadingPersonsError, setLoadingPersonsError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await getPersons(100, setIsLoadingPersons, setLoadingPersonsError);
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

  const handleDeletePersons = () => {
    setError('handleDeletePersons is not implemented yet');
  };

  return (
    <>
      {isLoadingPersons && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingPersonsError && (
        <Typography color="red" variant="body1">
          {loadingPersonsError.message}
        </Typography>
      )}
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
    </>
  );
};
