import { Typography, List, ListItem, IconButton } from '@mui/material';
import { FC } from 'react';
import { Person } from '../types/person';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  persons: Person[];
  handleDeleteClick: (id: string) => void;
  headerText: string;
}

export const RelationPersonListComponent: FC<Props> = ({ persons, handleDeleteClick, headerText }) => {
  return (
    <>
      <Typography variant="h6">{headerText}:</Typography>
      <List dense sx={{ maxWidth: '20rem', mb: '2rem' }}>
        {persons.map((person: Person) => (
          <ListItem
            key={person.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(person.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {person.firstName} {person.lastName}
          </ListItem>
        ))}
      </List>
    </>
  );
};
