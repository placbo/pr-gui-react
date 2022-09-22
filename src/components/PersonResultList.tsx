import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { PERSON_THUMBNAIL_URL } from '../constants';
import { Person } from '../types/person';

const PersonResultList: FC<{ persons: Person[]; handleClose: any }> = ({ persons, handleClose }) => {
  return (
    <List dense>
      {persons.map((person: Person) => (
        <ListItemButton key={person.id} component={Link} to={`/person/${person.id}`} onClick={handleClose}>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt={person.lastName} src={`${PERSON_THUMBNAIL_URL}${person.imageName}`} />
            </ListItemAvatar>
            <Typography>{[person.lastName, person.firstName].filter(Boolean).join(', ')}</Typography>
          </ListItem>
        </ListItemButton>
      ))}
    </List>
  );
};

export default PersonResultList;
