import { FC, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Dialog, DialogTitle, Button, DialogContent, Autocomplete, CircularProgress, TextField } from '@mui/material';

import { getAllCommunities } from '../api/api';
import { Community } from '../types/community';
import { ErrorAlert } from './ErrorAlert';

interface ISelectCommunityDialogProps {
  open: boolean;
  onClose: (value?: string, name?: string) => void;
}

const StyledContentWrapper = styled.div`
  display: flex;
  padding: 1rem 0;
  gap: 1rem;
`;

export const SelectCommunityDialog: FC<ISelectCommunityDialogProps> = ({ onClose, open }) => {
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [loadingCommunitiesError, setLoadingCommunitiesError] = useState<Error | undefined>(undefined);

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = () => {
    if (selectedCommunity?.id && selectedCommunity?.name) {
      onClose(selectedCommunity.id, selectedCommunity.name);
    } else {
      onClose();
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
