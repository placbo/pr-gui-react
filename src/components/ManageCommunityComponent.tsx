import { Chip, CircularProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getCommunitiesForPerson, removePersonFromCommunity } from '../api/api';
import { Community } from '../types/community';
import { Person } from '../types/person';
import { ErrorAlert } from './ErrorAlert';

interface Props {
  person: Person;
}

export const ManageCommunitiesComponent: FC<Props> = ({ person }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncCallGetCommunitiesForPerson = async (personId: string) => {
      setCommunities(await getCommunitiesForPerson(personId, setApiError, setIsLoading));
    };

    asyncCallGetCommunitiesForPerson(person.id);
  }, [person]);

  const handleDelete = async (communityId: string) => {
    await removePersonFromCommunity(person.id, communityId, setApiError, setIsLoading);
    setCommunities((prevValue: Community[]) => {
      return prevValue.filter((community) => community.id !== communityId);
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Grupper
      </Typography>
      {isLoading ? (
        <CircularProgress color="inherit" size={'2rem'} />
      ) : apiError ? (
        <ErrorAlert errorMessage={apiError.message}></ErrorAlert>
      ) : (
        communities?.map((community, index) => (
          <Chip
            key={index}
            variant="outlined"
            label={community.name}
            sx={{ ml: 1 }}
            onClick={() => window.open(`/community/${community.id}`, '_blank', 'noopener')}
            onDelete={() => handleDelete(community.id)}
          />
        ))
      )}
    </>
  );
};
