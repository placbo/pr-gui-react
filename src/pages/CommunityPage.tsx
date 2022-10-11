import { FC, useEffect, useState } from 'react';
import { Community } from '../types/community';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { Colors, DeviceWidths } from '../theme';
import communityPlaceholderImage from '../resources/images/group.webp';
import { CircularProgress, Link, Typography } from '@mui/material';
import { COMMUNITY_IMAGES_MEDIUM_URL, COMMUNITY_IMAGE_URL } from '../constants';
import HeadingWithLine from '../components/HeadingWithLine';
import PersonResultGrid from '../components/PersonResultGrid';
import { Person } from '../types/person';
import { getCommunity, getPersonsInCommunity } from '../api/api';
import { ErrorAlert } from '../components/ErrorAlert';

const StyledCommunityPresentation = styled.div`
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

export const CommunityPage: FC = () => {
  const { identifier } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error | undefined>(undefined);

  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const asyncFunc = async () => {
      if (identifier) {
        setCommunity(await getCommunity(identifier, setLoadingError, setIsLoading));
        setPersons(await getPersonsInCommunity(identifier, setLoadingError, setIsLoading));
      }
    };
    asyncFunc();
  }, [identifier]);

  return (
    <StyledCommunityPresentation>
      {isLoading && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingError && <ErrorAlert errorMessage={loadingError.message}></ErrorAlert>}
      {community && (
        <>
          <StyledHeader>
            <StyledImageWrapper>
              <Link
                href={`${COMMUNITY_IMAGES_MEDIUM_URL}${community.imageURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledImage
                  alt="Community"
                  src={community.imageURL ? `${COMMUNITY_IMAGE_URL}${community.imageURL}` : communityPlaceholderImage}
                />
              </Link>
            </StyledImageWrapper>
            <StyledDetailsWrapper>
              <StyledNameTypography variant="h3">{`${community.name}`}</StyledNameTypography>
            </StyledDetailsWrapper>
          </StyledHeader>
          {persons && (
            <>
              <HeadingWithLine text="Personer" />
              <PersonResultGrid persons={persons} />
            </>
          )}
        </>
      )}
    </StyledCommunityPresentation>
  );
};
