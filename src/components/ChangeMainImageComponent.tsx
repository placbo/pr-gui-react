import { FC, useState, ChangeEvent } from 'react';

import styled from '@emotion/styled';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Button, CircularProgress, Link } from '@mui/material';

import { uploadImage } from '../api/api';
import { COMMUNITY_IMAGES_MEDIUM_URL, PERSON_IMAGES_MEDIUM_URL } from '../constants';
import communityPlaceholderImage from '../resources/images/group.webp';
import personPlaceholderImage from '../resources/images/person.png';
import { Colors, DeviceWidths } from '../theme';
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

export enum Category {
  PERSON = 'person',
  COMMUNITY = 'community',
}

interface Props {
  id: string;
  imageName: string;
  category: Category;
}

export const ChangeMainImageComponent: FC<Props> = ({ id, imageName, category }) => {
  const [error, setError] = useState('');
  const [imageFileName, setImageFileName] = useState(imageName);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const imageBaseURL = category === Category.PERSON ? PERSON_IMAGES_MEDIUM_URL : COMMUNITY_IMAGES_MEDIUM_URL;
  const imagePlaceHolder = category === Category.PERSON ? personPlaceholderImage : communityPlaceholderImage;

  const handleFileUpload = async (file: File | null) => {
    if (file && file?.size < maxFileSizeMb) {
      const generatedFileName = await uploadImage(file, id, category, setError, setIsUploadingImage);
      generatedFileName && setImageFileName(generatedFileName);
    } else {
      setError('For stor fil');
    }
  };

  return (
    <>
      <StyledImageWrapper>
        <Link href={`${imageBaseURL}${imageFileName}`} target="_blank" rel="noopener noreferrer">
          <StyledImage
            alt="Person"
            src={imageFileName ? `${imageBaseURL}${imageFileName}` : imagePlaceHolder}
            //onError={(event: any) => (event.target.src = imagePlaceHolder)}
          />
        </Link>

        <Button variant="text" startIcon={<PhotoCamera />} component="label">
          <input
            id="file-upload"
            accept="image/png, image/gif, image/jpeg"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
