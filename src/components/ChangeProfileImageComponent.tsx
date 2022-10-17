import { Button, CircularProgress, Link } from '@mui/material';
import { FC, useState } from 'react';
import { Person } from '../types/person';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { PERSON_IMAGE_URL } from '../constants';
import styled from '@emotion/styled';
import { Colors, DeviceWidths } from '../theme';
import personPlaceholderImage from '../resources/images/person.png';
import { uploadImage } from '../api/api';
import { ErrorAlert } from './ErrorAlert';

const StyledImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: ${Colors.FaintBlue};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const StyledImage = styled.img`
  width: 10rem;
  height: 10rem;
  object-fit: cover;
  border: 1px solid ${Colors.PrimaryText};
  @media (max-width: ${DeviceWidths.sm}) {
    width: 15rem;
    height: 15rem;
  }
`;

const maxFileSizeMb = 4 * 1024 * 1024;

interface Props {
  person: Person;
}

export const ChangeProfileImageComponent: FC<Props> = ({ person }) => {
  const [error, setError] = useState('');
  const [imageName, setImageName] = useState(person.imageName);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileUpload = async (file: File | null) => {
    if (file && file?.size < maxFileSizeMb) {
      const generatedFileName = await uploadImage(file, person.id, setError, setIsUploadingImage);
      generatedFileName && setImageName(generatedFileName);
    } else {
      setError('For stor fil');
    }
  };

  return (
    <>
      <StyledImageWrapper>
        <Link href={`${PERSON_IMAGE_URL}${imageName}`} target="_blank" rel="noopener noreferrer">
          <StyledImage
            alt="Person"
            src={imageName ? `${PERSON_IMAGE_URL}${imageName}` : personPlaceholderImage}
            onError={(event: any) => (event.target.src = personPlaceholderImage)}
          />
        </Link>

        <Button variant="text" startIcon={<PhotoCamera />} component="label">
          <input
            id="file-upload"
            accept="image/png, image/gif, image/jpeg"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleFileUpload(event.target.files && event.target.files[0]);
            }}
            type="file"
            style={{ display: 'none' }}
          />
          Last opp nytt profilbilde
        </Button>

        {isUploadingImage && <CircularProgress size={'1rem'} style={{ marginLeft: '1rem' }} />}
        {error && <ErrorAlert errorMessage={error}></ErrorAlert>}
      </StyledImageWrapper>
    </>
  );
};
