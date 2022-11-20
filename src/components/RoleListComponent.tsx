import { FC, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Typography, List, ListItem, IconButton, Divider, CircularProgress } from '@mui/material';

import { removeRelation } from '../api/api';
import { Person } from '../types/person';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorAlert } from './ErrorAlert';

interface Props {
  persons: Person[];
  mainPerson: Person;
  retrievAllRelations: any;
  headerText: string;
  roleId: number;
}

export const RelationPersonListComponent: FC<Props> = ({
  persons,
  mainPerson,
  retrievAllRelations,
  headerText,
  roleId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [selectedRelatedPerson, setSelectedRelatedPerson] = useState('');
  const [apiError, setApiError] = useState<Error | undefined>(undefined);

  const handleDeleteClick = (personId: string) => {
    setSelectedRelatedPerson(personId);
    setIsConfirmDialogOpen(true);
    setConfirmationText(`Sikker på at du vil slette`);
  };

  const handleConfirmDeleteRole = async (shouldDelete: boolean) => {
    setIsConfirmDialogOpen(false);
    if (shouldDelete) {
      await removeRelation(selectedRelatedPerson, mainPerson.id, roleId, setApiError, setIsDeleting);
      retrievAllRelations();
    }
  };

  return (
    <>
      <Typography variant="h6">{headerText}:</Typography>
      <List sx={{ maxWidth: '20rem', mb: '2rem' }}>
        {persons.map((person: Person) => (
          <>
            <ListItem
              key={person.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  disabled={isDeleting}
                  onClick={() => handleDeleteClick(person.id)}
                >
                  {isDeleting && <CircularProgress color="inherit" size={'1rem'} />} <DeleteIcon />
                </IconButton>
              }
            >
              {person.firstName} {person.lastName}
            </ListItem>
            <Divider variant="middle" component="li" />
          </>
        ))}
      </List>
      {apiError && <ErrorAlert errorMessage={apiError.message}></ErrorAlert>}
      <ConfirmDialog open={isConfirmDialogOpen} text={confirmationText} handleConfirm={handleConfirmDeleteRole} />
    </>
  );
};
