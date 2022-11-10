import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { addPersonToCommunity, getCommunitiesForPerson, removePersonFromCommunity } from '../api/api';
import { Community } from '../types/community';
import { Person } from '../types/person';
import { ErrorAlert } from './ErrorAlert';
import { SelectCommunityDialog } from './SelectCommunityDialog';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import styled from '@emotion/styled';

const StyledChipWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

interface Props {
  person: Person;
}

export const ManageCommunitiesComponent: FC<Props> = ({ person }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [apiError, setApiError] = useState<Error | undefined>(undefined);

  const [isAddToCommunityDialogOpen, setIsAddToCommunityDialogOpen] = useState(false);

  const retrieve = useCallback(() => {
    const asyncApiCalls = async () => {
      if (person?.id) {
        setCommunities(await getCommunitiesForPerson(person.id, setApiError, setIsWaiting));
      }
    };
    asyncApiCalls();
  }, [person.id]);

  useEffect(() => {
    retrieve();
  }, [retrieve]);

  const handleDelete = async (communityId: string) => {
    setApiError(undefined);
    await removePersonFromCommunity(person.id, communityId, setApiError, setIsWaiting);
    retrieve();
  };

  const handleAddPersonToCommunity = async (communityId: string | undefined) => {
    setIsAddToCommunityDialogOpen(false);
    setApiError(undefined);
    if (communityId) {
      await addPersonToCommunity(person.id, communityId, setApiError, setIsWaiting);
      retrieve();
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Grupper
      </Typography>
      {isWaiting ? (
        <CircularProgress color="inherit" size={'2rem'} />
      ) : (
        <>
          <StyledChipWrapper>
            {communities?.map((community, index) => (
              <Chip
                key={index}
                variant="outlined"
                label={community.name}
                sx={{ ml: 1 }}
                onClick={() => window.open(`/community/${community.id}`, '_blank', 'noopener')}
                onDelete={() => handleDelete(community.id)}
              />
            ))}
            <Button
              variant="contained"
              startIcon={<GroupAddIcon />}
              onClick={() => setIsAddToCommunityDialogOpen(true)}
            >
              Legg til gruppe
            </Button>
          </StyledChipWrapper>
          {apiError && (
            <Box sx={{ mt: '1rem' }}>
              <ErrorAlert errorMessage={apiError.message}></ErrorAlert>
            </Box>
          )}
        </>
      )}
      <SelectCommunityDialog open={isAddToCommunityDialogOpen} onClose={handleAddPersonToCommunity} />
    </>
  );
};
