import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Person } from '../types/person';
import { Colors, DeviceWidths } from '../theme';
import placeholder from '../resources/images/person.png';
import { Link } from 'react-router-dom';

const StyledResultList = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${DeviceWidths.sm}) {
    flex-direction: column;
    width: 100%;
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

const StyledCardActionArea: any = styled(CardActionArea)`
  @media (max-width: ${DeviceWidths.sm}) {
    display: flex;
    justify-content: flex-start;
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

const PersonResultGrid: FC<{ persons: Person[] }> = ({ persons }) => {
  const sortedPersons = persons.sort((a, b) =>
    (a.lastName?.toUpperCase() ?? '') > (b.lastName?.toUpperCase() ?? '')
      ? 1
      : (a.lastName?.toUpperCase() ?? '') === (b.lastName?.toUpperCase() ?? '')
      ? (a.firstName?.toUpperCase() ?? '') > (b.firstName?.toUpperCase() ?? '')
        ? 1
        : -1
      : -1
  );

  return (
    <StyledResultList>
      {sortedPersons.map((person: Person, index) => (
        <StyledCard variant="outlined" key={index}>
          <StyledLink to={`/person/${person.personID}`}>
            <StyledCardActionArea>
              <StyledCardMedia
                image={person.mainImage ? person.mainImage : placeholder}
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
      ))}
    </StyledResultList>
  );
};

export default PersonResultGrid;
