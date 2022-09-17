import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, Typography } from '@mui/material';
import React, { FC } from 'react';
import { Person } from '../types/person';
import { Link } from 'react-router-dom';
import { PERSON_THUMBNAIL_URL } from '../constants';

const PersonResultList: FC<{ persons: Person[] }> = ({ persons }) => {
  return (
    <List dense>
      {persons.map((person: Person) => (
        <ListItemButton component={Link} to={`/person/${person.id}`}>
          <ListItem key={person.id}>
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
