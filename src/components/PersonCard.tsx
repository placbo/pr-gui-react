import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Person } from '../types/person';
import { Colors, DeviceWidths } from '../theme';
import { PERSON_THUMBNAIL_URL } from '../constants';
import placeholder from '../resources/images/person.png';
import { Link } from 'react-router-dom';

const StyledCardActionArea: any = styled(CardActionArea)`
  @media (max-width: ${DeviceWidths.sm}) {
    display: flex;
    justify-content: flex-start;
  }
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

const StyledLink = styled(Link)`
  color: ${Colors.PrimaryText};
  text-decoration: none;
`;

interface Props {
  person: Person;
}

const PersonCard: FC<Props> = ({ person }) => {
  return (
    <StyledCard variant="outlined" key={person.id}>
      <StyledLink to={`/person/${person.id}`}>
        <StyledCardActionArea>
          <StyledCardMedia
            image={person.imageName ? `${PERSON_THUMBNAIL_URL}${person.imageName}` : placeholder}
            title="Profile photo"
          />
          <StyledCardContent>
            <StyledTypography gutterBottom variant={'body2'}>
              {[person.lastName, person.firstName].filter(Boolean).join(', ')}
            </StyledTypography>
          </StyledCardContent>
        </StyledCardActionArea>
      </StyledLink>
    </StyledCard>
  );
};

export default PersonCard;
