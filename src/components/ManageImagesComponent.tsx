import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { getPersonsImages, removeImage } from '../api/api';
import { Image } from '../types/image';
import { Person } from '../types/person';
import { ErrorAlert } from './ErrorAlert';
import styled from '@emotion/styled';
import { PERSON_THUMBNAIL_URL } from '../constants';
import placeholderPersonImage from '../resources/images/person.png';
import { DeviceWidths } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';

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

const StyledCardContent = styled(CardContent)`
  padding: 0.5rem;
  height: 4rem;
  text-align: center;
  font-weight: bold;
  @media (max-width: ${DeviceWidths.sm}) {
    text-align: left;
  }
`;

const StyledTypography = styled(Typography)`
  font-weight: 500;
  text-overflow: ellipsis;
  font-size: small;
`;

interface Props {
  person: Person;
}

export const ManageImagesComponent: FC<Props> = ({ person }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [apiError, setApiError] = useState<Error | undefined>(undefined);

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

  const handleDelete = async (communityId: string) => {
    setApiError(undefined);
    await removeImage(person.id, setApiError, setIsWaiting);
    retrieve();
  };

  //TODO: handle delete
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
                <CardActions>
                  <IconButton aria-label="sletteknapp" size="small" onClick={() => alert('delete not implemented')}>
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
        </>
      )}
    </>
  );
};
