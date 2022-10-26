import React, { FC, useEffect, useState } from 'react';
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
import { PERSON_IMAGE_URL } from '../constants';
import HeadingWithLine from '../components/HeadingWithLine';
import CommunityResultGrid from '../components/CommunityResultGrid';
import { deletePerson, getPerson, getPersonsChildren, getPersonsParents } from '../api/api';
import { Person } from '../types/person';
import { ErrorAlert } from '../components/ErrorAlert';
import PersonResultGrid from '../components/PersonResultGrid';
import { ConfirmDialog } from '../components/ConfirmDialog';

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

  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [isLoadingPerson, setIsLoadingPerson] = useState(false);
  const [loadingPersonError, setLoadingPersonError] = useState<Error | undefined>(undefined);

  const [parents, setParents] = useState<Person[]>([]);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [loadingParentsError, setLoadingParentsError] = useState<Error | undefined>(undefined);

  const [children, setChildren] = useState<Person[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [loadingChildrenError, setLoadingChildrenError] = useState<Error | undefined>(undefined);

  const [deletingError, setDeletingError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>('');

  useEffect(() => {
    const asyncApiCalls = async () => {
      if (identifier) {
        setPerson(await getPerson(identifier, setLoadingPersonError, setIsLoadingPerson));
        setParents(await getPersonsParents(identifier, setLoadingParentsError, setIsLoadingParents));
        setChildren(await getPersonsChildren(identifier, setLoadingChildrenError, setIsLoadingChildren));
      }
    };
    asyncApiCalls();
  }, [identifier]);

  const handleDeleteClick = () => {
    setIsConfirmDialogOpen(true);
    setConfirmationText(`Sikker på at du vil slette ${person?.firstName} ${person?.lastName}`);
  };

  const handleConfirmDelete = async (shouldDelete: boolean) => {
    setIsConfirmDialogOpen(false);
    if (shouldDelete && person) {
      await deletePerson(person?.id, setDeletingError, setIsDeleting);
      //todo: få fikset denne
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
  };

  return (
    <StyledPersonPresentation>
      {isLoadingPerson && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingPersonError && <ErrorAlert errorMessage={loadingPersonError.message}></ErrorAlert>}
      {person && (
        <>
          <StyledHeader>
            <StyledImageWrapper>
              <Link href={`${PERSON_IMAGE_URL}${person.imageName}`} target="_blank" rel="noopener noreferrer">
                <StyledImage
                  alt="Person"
                  src={person.imageName ? `${PERSON_IMAGE_URL}${person.imageName}` : personPlaceholderImage}
                  onError={(event: any) => (event.target.src = personPlaceholderImage)}
                />
              </Link>
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
                <IconButton aria-label="" component={RouterLink} to={`/editperson/${identifier}`}>
                  <EditOutlinedIcon />
                </IconButton>
              </StyledActions>
            </StyledDetailsWrapper>
          </StyledHeader>

          {isDeleting && <CircularProgress size={'2rem'} />}
          {deletingError && <ErrorAlert errorMessage={deletingError}></ErrorAlert>}

          <HeadingWithLine text="Grupper" />
          <CommunityResultGrid personId={person.id} />

          {parents && parents.length > 0 && (
            <>
              <HeadingWithLine text="Foreldre" />
              {isLoadingParents && <CircularProgress color="inherit" size={'2rem'} />}
              {loadingParentsError && <ErrorAlert errorMessage={loadingParentsError.message}></ErrorAlert>}
              <PersonResultGrid persons={parents}></PersonResultGrid>
            </>
          )}
          {children && children.length > 0 && (
            <>
              <HeadingWithLine text="Barn" />
              {isLoadingChildren && <CircularProgress color="inherit" size={'2rem'} />}
              {loadingChildrenError && <ErrorAlert errorMessage={loadingChildrenError.message}></ErrorAlert>}
              <PersonResultGrid persons={children}></PersonResultGrid>
            </>
          )}
        </>
      )}
      <ConfirmDialog open={isConfirmDialogOpen} text={confirmationText} handleConfirm={handleConfirmDelete} />
    </StyledPersonPresentation>
  );
};
