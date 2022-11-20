import { FC, useCallback, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardActions, CardMedia, CircularProgress, IconButton, Typography } from '@mui/material';

import { getPersonsImages, removeImage } from '../api/api';
import { PERSON_THUMBNAIL_URL } from '../constants';
import placeholderPersonImage from '../resources/images/person.png';
import { DeviceWidths } from '../theme';
import { Image } from '../types/image';
import { Person } from '../types/person';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorAlert } from './ErrorAlert';

const StyledWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledCard = styled(Card)`
  width: 7rem;
  margin: 0.5rem;
  @media (max-width: ${DeviceWidths.sm}) {
    display: flex;
    width: 100%;
    margin: 0.5rem 0;
  }
`;

const StyledCardMedia: any = styled(CardMedia)`
  height: 7rem;
  @media (max-width: ${DeviceWidths.sm}) {
    min-width: 4rem;
    height: 4rem;
  }
`;
interface Props {
  person: Person;
}

export const ManageImagesComponent: FC<Props> = ({ person }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [apiError, setApiError] = useState<Error | undefined>(undefined);

  const [imageIdToBeDeleted, setImageIdToBeDeleted] = useState('');

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>('');

  const retrieve = useCallback(() => {
    const asyncApiCalls = async () => {
      if (person?.id) {
        setImages(await getPersonsImages(person.id, setApiError, setIsWaiting));
      }
    };
    asyncApiCalls();
  }, [person.id]);

  useEffect(() => {
    retrieve();
  }, [retrieve]);

  const handleDeleteClick = (imageId: string) => {
    setImageIdToBeDeleted(imageId);
    setIsConfirmDialogOpen(true);
    setConfirmationText(`Sikker på at du vil fjerne bildet`);
  };

  const handleConfirmRemoveImage = async (shouldDelete: boolean) => {
    setIsConfirmDialogOpen(false);
    if (shouldDelete) {
      await removeImage(imageIdToBeDeleted, setApiError, setIsWaiting);
      retrieve();
    }
  };

  //TODO: sette som profilbilde
  //TODO: Vise hva som er profilbilde
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Bilder
      </Typography>
      {isWaiting ? (
        <CircularProgress color="inherit" size={'2rem'} />
      ) : (
        <>
          <StyledWrapper>
            {images?.map((image, index) => (
              <StyledCard key={index} variant="outlined">
                <StyledCardMedia
                  image={image.filename ? `${PERSON_THUMBNAIL_URL}${image.filename}` : placeholderPersonImage}
                  title="Profile photo"
                />
                <pre> {image.id} </pre>
                <CardActions>
                  <IconButton aria-label="sletteknapp" size="small" onClick={() => handleDeleteClick(image.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </StyledCard>
            ))}
          </StyledWrapper>
          {apiError && (
            <Box sx={{ mt: '1rem' }}>
              <ErrorAlert errorMessage={apiError.message}></ErrorAlert>
            </Box>
          )}
          <ConfirmDialog open={isConfirmDialogOpen} text={confirmationText} handleConfirm={handleConfirmRemoveImage} />
        </>
      )}
    </>
  );
};
