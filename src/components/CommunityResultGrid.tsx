import { FC, useEffect, useState } from 'react';
import { Community } from '../types/community';
import { Colors, DeviceWidths } from '../theme';
import communityPlaceholderImage from '../resources/images/group.webp';
import styled from '@emotion/styled';
import { Card, CardActionArea, CardContent, CardMedia, CircularProgress, Typography } from '@mui/material';
import { COMMUNITY_THUMBNAIL_URL } from '../constants';
// import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getAllCommunities, getCommunitiesForPerson } from '../api/api';
import { ErrorAlert } from './ErrorAlert';

const StyledResultList = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${DeviceWidths.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledCard = styled(Card)`
  width: 7rem;
  margin: 0.5rem;
  background-color: ${Colors.SubtleBackground};
  && .MuiCardActionArea-root:hover {
    background-color: ${Colors.SubtleBackgroundHover};
  }
  @media (max-width: ${DeviceWidths.sm}) {
    display: flex;
    width: 100%;
    margin: 0.5rem 0;
  }
`;

const StyledCardActionArea: any = styled(CardActionArea)`
  height: 100%;
  @media (max-width: ${DeviceWidths.sm}) {
    display: flex;
    justify-content: flex-start;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 7rem;
  @media (max-width: ${DeviceWidths.sm}) {
    min-width: 4rem;
    height: 4rem;
  }
`;

const StyledCardContent = styled(CardContent)`
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  color: ${Colors.PrimaryText};
  text-decoration: none;
`;

const StyledTypography = styled(Typography)`
  font-weight: 500;
  text-overflow: ellipsis;
  font-size: small;
`;

// const StyledAdd = styled(Add)`
//   font-size: 3rem;
// `;
//
// const StyledAddButton = styled(Button)`
//   margin-left: 1rem;
// `;
//
// const StyledAddButtonWrapper = styled.div`
//   width: 7rem;
//   height: 11rem;
//   margin: 0.5rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   @media (max-width: ${DeviceWidths.sm}) {
//     width: 100%;
//     height: 4rem;
//     margin: 0.5rem 0;
//   }
// `;

// const StyledContentWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 30rem;
//   margin: 0.5rem;
// `;

interface CommunityResultGridProps {
  personId?: string;
}

const CommunityResultGrid: FC<CommunityResultGridProps> = ({ personId }) => {
  // const [isAddCommunityDialogOpen, setIsAddCommunityDialogOpen] = useState(false);
  // const [isAddCommunityToPersonDialogOpen, setIsAddCommunityToPersonDialogOpen] = useState(false);
  // const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  // const [selectedCommunityToAdd, setSelectedCommunityToAdd] = useState<Community | null>(null);
  const [communities, setCommunities] = useState([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [loadingCommunitiesError, setLoadingCommunitiesError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncCallGetCommunitiesForPerson = async (_personsId: string) => {
      setCommunities(await getCommunitiesForPerson(_personsId, setLoadingCommunitiesError, setIsLoadingCommunities));
    };
    const asyncCallGetAllCommunities = async () => {
      setCommunities(await getAllCommunities(setLoadingCommunitiesError, setIsLoadingCommunities));
    };
    personId ? asyncCallGetCommunitiesForPerson(personId) : asyncCallGetAllCommunities();
  }, [personId]);

  // const { communities, isLoading, loadingError } = useCommunities(personId);

  // const loadCommunities = (personId: string | undefined) => {
  //   if (personId) {
  //     getCommunitiesForPerson(personId)
  //       .then((result) => {
  //         setCommunities(result);
  //       })
  //       .catch((error: any) => console.error(error.message));
  //   } else {
  //     getAllCommunities()
  //       .then((result: Community[]) => {
  //         setCommunities(result);
  //       })
  //       .catch((error: any) => console.error(error.message));
  //   }
  // };

  // useEffect(() => {
  //   loadCommunities(personId);
  // }, [personId]);
  //
  // useEffect(() => {
  //   getAllCommunities()
  //     .then((result: Community[]) => {
  //       setAllCommunities(result);
  //     })
  //     .catch((error: any) => console.error(error.message));
  // }, []);

  // const handleAddCommunityToPerson = () => {
  //   if (selectedCommunityToAdd && personId) {
  //     connectCommunityAndPerson(personId, selectedCommunityToAdd.id)
  //       .then(() => {
  //         loadCommunities(personId);
  //       })
  //       .catch((error: any) => console.error(error.message));
  //     toggleAddCommunityToPersonDialog();
  //   }
  // };

  // const toggleAddCommunityDialog = () => {
  //   setIsAddCommunityDialogOpen(!isAddCommunityDialogOpen);
  // };
  //
  // const toggleAddCommunityToPersonDialog = () => {
  //   setIsAddCommunityToPersonDialogOpen(!isAddCommunityToPersonDialogOpen);
  // };

  return (
    <StyledResultList>
      {isLoadingCommunities && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingCommunitiesError && <ErrorAlert errorMessage={loadingCommunitiesError.message}></ErrorAlert>}{' '}
      {communities &&
        communities.length > 0 &&
        communities.map((community: Community) => (
          <StyledCard variant="outlined" key={community.id}>
            <StyledLink to={`/community/${community.id}`}>
              <StyledCardActionArea>
                <StyledCardMedia
                  image={
                    community.imageURL ? `${COMMUNITY_THUMBNAIL_URL}${community.imageURL}` : communityPlaceholderImage
                  }
                  title="community photo"
                />
                <StyledCardContent>
                  <StyledTypography gutterBottom variant="body2">
                    {community.name}
                  </StyledTypography>
                </StyledCardContent>
              </StyledCardActionArea>
            </StyledLink>
          </StyledCard>
        ))}
      {/*
      <StyledAddButtonWrapper>
        {personId ? (
          <IconButton component="label" onClick={toggleAddCommunityToPersonDialog}>
            <StyledAdd />
          </IconButton>
        ) : (
          <IconButton component="label" onClick={toggleAddCommunityDialog}>
            <StyledAdd />
          </IconButton>
        )}
      </StyledAddButtonWrapper>
*/}
      {/*    {isAddCommunityToPersonDialogOpen && (
        <Dialog
          open={isAddCommunityToPersonDialogOpen}
          onClose={handleAddCommunityToPerson}
          aria-labelledby="responsive-dialog-title"
          id="add_community_dialog">
          <DialogTitle>Legg til gruppe</DialogTitle>
          <DialogContent>
            <StyledContentWrapper>
              <Autocomplete
                id="communities-dropdown"
                options={allCommunities}
                getOptionLabel={(community) => community.name}
                style={{ width: '20rem' }}
                value={selectedCommunityToAdd}
                getOptionSelected={(option, value) => option.name === value.name}
                onChange={(event: any, newValue: Community | null) => {
                  setSelectedCommunityToAdd(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
              />
              <StyledAddButton
                disabled={!selectedCommunityToAdd}
                color="primary"
                variant={'contained'}
                onClick={handleAddCommunityToPerson}>
                Velg
              </StyledAddButton>
            </StyledContentWrapper>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleAddCommunityToPersonDialog}>Lukk</Button>
          </DialogActions>
        </Dialog>
      )}
*/}
      {/*      {isAddCommunityDialogOpen && (
        <EditCommunityDialog
          isEditDialogOpen={isAddCommunityDialogOpen}
          handleToggleDialog={toggleAddCommunityDialog}
        />
      )}*/}
    </StyledResultList>
  );
};

export default CommunityResultGrid;
