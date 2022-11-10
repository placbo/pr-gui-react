import styled from '@emotion/styled';
import { Dialog, DialogTitle, Button, DialogContent, Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAllCommunities } from '../api/api';
import { Community } from '../types/community';
import { ErrorAlert } from './ErrorAlert';

interface Props {
  open: boolean;
  onClose: (value: string | undefined) => void;
}

const StyledContentWrapper = styled.div`
  display: flex;
  padding: 1rem 0;
  gap: 1rem;
`;

export const SelectCommunityDialog = (props: Props) => {
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [loadingCommunitiesError, setLoadingCommunitiesError] = useState<Error | undefined>(undefined);
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(undefined);
  };

  const handleListItemClick = () => {
    if (selectedCommunity) {
      onClose(selectedCommunity.id);
    }
  };

  useEffect(() => {
    const asyncCall = async () => {
      setAllCommunities(await getAllCommunities(setLoadingCommunitiesError, setIsLoadingCommunities));
    };
    asyncCall();
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Velg gruppe</DialogTitle>
      <DialogContent>
        {isLoadingCommunities && <CircularProgress color="inherit" size={'2rem'} />}
        {loadingCommunitiesError && <ErrorAlert errorMessage={loadingCommunitiesError.message}></ErrorAlert>}{' '}
        <StyledContentWrapper>
          <Autocomplete
            id="communities-dropdown"
            options={allCommunities}
            getOptionLabel={(community) => community.name}
            style={{ width: '20rem' }}
            value={selectedCommunity}
            onChange={(event: any, newValue: Community | null) => {
              setSelectedCommunity(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Gruppe" variant="outlined" />}
          />
          <Button disabled={!selectedCommunity} variant="contained" onClick={handleListItemClick}>
            velg
          </Button>
        </StyledContentWrapper>
      </DialogContent>
    </Dialog>
  );
};
