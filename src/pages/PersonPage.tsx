import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import { Colors, DeviceWidths } from '../theme';
import { FaCross } from 'react-icons/fa';

import personPlaceholderImage from '../resources/images/person.png';
import { CircularProgress, IconButton, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { IMAGE_UPLOAD_URL, PERSON_IMAGE_URL } from '../constants';
import HeadingWithLine from '../components/HeadingWithLine';
import CommunityResultGrid from '../components/CommunityResultGrid';
import { deletePerson, usePerson, usePersonChildren, usePersonParents } from '../components/api';
import PersonResultGrid from '../components/PersonResultGrid';

const StyledPersonPresentation = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60rem;
  min-width: 10rem;
  width: 100%;
  margin-top: 3rem;
`;

const StyledHeader = styled.div`
  display: flex;
  @media (max-width: ${DeviceWidths.sm}) {
    flex-wrap: wrap;
  }
`;

const StyledDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (max-width: ${DeviceWidths.sm}) {
    text-align: center;
  }
`;

const StyledSeparator = styled.div`
  flex-grow: 1;
`;

const StyledImageWrapper = styled.div`
  margin: 1rem 1rem 1rem 0.5rem;
  @media (max-width: ${DeviceWidths.sm}) {
    margin: 0;
    display: flex;
    width: 100%;
    justify-content: center;
  }
`;

const StyledImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border: 1px solid ${Colors.PrimaryText};
  @media (max-width: ${DeviceWidths.sm}) {
    width: 15rem;
    height: 15rem;
  }
`;

const StyledNameTypography = styled(Typography)`
  margin-top: 1rem;
  font-family: inherit;
`;

const StyledNoteTypography = styled(Typography)`
  margin-top: 2rem;
  font-family: inherit;
`;

// eslint-disable-next-line
const StyledLabelButtonFileUpload = styled.label`
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: ${DeviceWidths.sm}) {
    padding-top: 1rem;
    justify-content: center;
  }
`;

export const PersonPage: FC = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const { person } = usePerson(identifier);
  const { parents } = usePersonParents(identifier);
  const { children } = usePersonChildren(identifier);

  const handleDeleteClick = () => {
    if (identifier && window.confirm(`Really delete ${person?.firstName} ${person?.lastName} ?`)) {
      deletePerson(identifier);
      navigate('/');
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File | null) => {
    if (file) {
      try {
        setIsUploading(true);
        //TODO: Scale image client side ?
        const formData = new FormData();
        formData.append('image', file);
        formData.append('personid', person.id);
        await axios.post(IMAGE_UPLOAD_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'X-Auth-Token': localStorage.getItem('token') ?? '' },
        });
      } catch (error) {
        console.log('ERROR', error);
        //TODO: error-handling
      }
      setIsUploading(false);
      window.location.reload();
    }
  };

  return (
    <StyledPersonPresentation>
      {person && (
        <>
          <StyledHeader>
            <StyledImageWrapper>
              <Link href={`${PERSON_IMAGE_URL}${person.imageName}`} target="_blank" rel="noopener noreferrer">
                <StyledImage
                  alt="Person"
                  src={person.imageName ? `${PERSON_IMAGE_URL}${person.imageName}` : personPlaceholderImage}
                />
              </Link>
              <div>
                <StyledLabelButtonFileUpload htmlFor="file-upload">Velg nytt profilbilde</StyledLabelButtonFileUpload>
                <input
                  id="file-upload"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleFileUpload(event.target.files && event.target.files[0]);
                  }}
                  type="file"
                  style={{ display: 'none' }}
                />
                {isUploading && <CircularProgress size={'1rem'} style={{ marginLeft: '1rem' }} />}
              </div>
            </StyledImageWrapper>
            <StyledDetailsWrapper>
              <StyledNameTypography variant="h3">{`${person.firstName} ${person.lastName}`}</StyledNameTypography>
              {person.note && <StyledNoteTypography variant="body1">{person.note}</StyledNoteTypography>}
              {(person.born || person.dead) && (
                <StyledNoteTypography variant="body2">
                  {person.born} - {person.dead === 'x' ? <FaCross /> : <span>{person.dead}</span>}
                </StyledNoteTypography>
              )}
              <StyledSeparator />
              <StyledActions>
                {person.facebookLink && (
                  <IconButton
                    style={{ color: Colors.Primary }}
                    href={`https://www.facebook.com/${person.facebookLink}`}
                    target="_blank"
                    aria-label="facebook link"
                  >
                    <FacebookIcon />
                  </IconButton>
                )}
                <IconButton aria-label="" onClick={handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="" component={RouterLink} to={`/editperson?id=${identifier}`}>
                  <EditOutlinedIcon />
                </IconButton>
              </StyledActions>
            </StyledDetailsWrapper>
          </StyledHeader>

          <HeadingWithLine text="Grupper" />
          <CommunityResultGrid personId={person.id} />

          <HeadingWithLine text="Foreldre og Barn" />
          {/* //TODO: lage egen komponent for denne */}
          {parents && <PersonResultGrid persons={parents}></PersonResultGrid>}
          {children && <PersonResultGrid persons={children}></PersonResultGrid>}
        </>
      )}
    </StyledPersonPresentation>
  );
};
