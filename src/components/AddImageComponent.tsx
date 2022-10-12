import { Dispatch, FC, SetStateAction, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddAPhoto from '@mui/icons-material/AddAPhoto';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { IMAGE_UPLOAD_URL, PERSON_IMAGE_URL } from '../constants';
import { Colors } from '../theme';
import personPlaceholderImage from '../resources/images/person.png';

const StyledAddImageWrapper = styled.div`
  height: 6rem;
  width: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed lightgray;
`;

const StyledImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border: 1px solid ${Colors.PrimaryText};
`;

const maxFileSizeMb = 4 * 1024 * 1024;

interface Props {
  personId: string;
  setError: Dispatch<SetStateAction<string>>;
}

export const AddImageComponent: FC<Props> = ({ personId, setError }) => {
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileUpload = async (file: File | null) => {
    if (file && file?.size < maxFileSizeMb) {
      try {
        setError('');
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('personid', personId);
        const result = await axios.post(IMAGE_UPLOAD_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'X-Auth-Token': localStorage.getItem('token') ?? '' },
        });
        setImageFileName(result.data.filename);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        }
      }
      setIsUploadingImage(false);
    } else {
      setError('For stor fil');
    }
  };

  return (
    <StyledAddImageWrapper>
      {isUploadingImage ? (
        <CircularProgress size={'1rem'} />
      ) : imageFileName ? (
        <StyledImage
          alt="Person"
          src={`${PERSON_IMAGE_URL}${imageFileName}`}
          onError={(event: any) => (event.target.src = personPlaceholderImage)}
        />
      ) : (
        <IconButton disabled={!personId} size="large" color="primary" aria-label="upload picture" component="label">
          <input
            id="file-upload"
            hidden
            accept="image/png, image/gif, image/jpeg"
            type="file"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleFileUpload(event.target.files && event.target.files[0]);
            }}
          />
          <AddAPhoto fontSize="large" />
        </IconButton>
      )}
    </StyledAddImageWrapper>
  );
};
