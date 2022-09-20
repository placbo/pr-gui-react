import React, { FC, useEffect, useState } from 'react';
import { Person } from '../types/person';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import { Colors, DeviceWidths } from '../theme';
import { FaCross } from 'react-icons/fa';

import personPlaceholderImage from '../resources/images/person.png';
// eslint-disable-next-line
import { CircularProgress, IconButton, Link, Typography } from '@mui/material';
import axios from 'axios';
import { PERSONS_URL, PERSON_IMAGES_MEDIUM_URL, PERSON_IMAGE_URL } from '../constants';
import HeadingWithLine from '../components/HeadingWithLine';
import CommunityResultGrid from '../components/CommunityResultGrid';
import PersonCard from '../components/PersonCard';
import EditPersonDialog from '../components/EditPersonDialog';
import { v4 } from 'uuid';

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
  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [parents, setParents] = useState<Person[]>([]);
  const [children, setChildren] = useState<Person[]>([]);

  useEffect(() => {
    const getPerson = async () => {
      const result = (
        await axios.get(`${PERSONS_URL}/${identifier}`, {
          headers: {
            'X-Auth-Token': localStorage.getItem('token') ?? '',
          },
        })
      ).data;
      setPerson(result);
    };
    const getParents = async () => {
      const result = (
        await axios.get(`${PERSONS_URL}/${identifier}/parents`, {
          headers: {
            'X-Auth-Token': localStorage.getItem('token') ?? '',
          },
        })
      ).data;
      setParents(result);
    };
    const getChildren = async () => {
      const result = (
        await axios.get(`${PERSONS_URL}/${identifier}/children`, {
          headers: {
            'X-Auth-Token': localStorage.getItem('token') ?? '',
          },
        })
      ).data;
      setChildren(result);
    };

    getPerson();
    getParents();
    getChildren();
  }, [identifier]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    if (window.confirm(`Really delete ${person?.firstName} ${person?.lastName} ?`)) {
      console.log('DELETING', person?.firstName);

      // deletePerson(identifier)
      //   .then(() => {
      //     history.push('/');
      //   })
      //   .catch((error: any) => console.error(error.message));
    }
  };

  const handleToggleEditDialog = () => {
    setIsEditDialogOpen(!isEditDialogOpen);
  };

  const [isUploading, setIsUploading] = useState(false);
  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    console.log('TODO: Laster opp bilde: ', file.name);
    //todo: Scale image
    //todo: Save thumbs as well
    const newImageName = v4();
    // MAKE IMAGE UPLOADER
    setIsUploading(false);
  };

  return (
    <StyledPersonPresentation>
      {person && (
        <>
          <StyledHeader>
            <StyledImageWrapper>
              <Link href={`${PERSON_IMAGES_MEDIUM_URL}${person.imageName}`} target="_blank" rel="noopener noreferrer">
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
                <IconButton aria-label="" onClick={handleToggleEditDialog}>
                  <EditOutlinedIcon />
                </IconButton>
              </StyledActions>
            </StyledDetailsWrapper>
          </StyledHeader>

          <HeadingWithLine text="Grupper" />
          <CommunityResultGrid personId={person.id} />

          <HeadingWithLine text="Familie" />
          {parents.map((parent: Person) => (
            <PersonCard person={parent}></PersonCard>
          ))}
          {children.map((children: Person) => (
            <PersonCard person={children}></PersonCard>
          ))}

          <EditPersonDialog
            isEditDialogOpen={isEditDialogOpen}
            handleToggleDialog={handleToggleEditDialog}
            person={person}
            setPerson={setPerson}
          />
        </>
      )}
    </StyledPersonPresentation>
  );
};
