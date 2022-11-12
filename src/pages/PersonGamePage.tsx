import styled from '@emotion/styled';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getRandomPerson } from '../api/api';
import { PERSON_IMAGE_URL } from '../constants';
import { Colors, DeviceWidths } from '../theme';
import { Person } from '../types/person';
import personPlaceholderImage from '../resources/images/person.png';
import { Link } from 'react-router-dom';

const PageWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 25rem;
  height: 28rem;
  padding: 1rem 1rem 1rem 1rem;
`;

const StyledCardActions = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 1rem;
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const StyledImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border: 1px solid ${Colors.PrimaryText};
  margin-bottom: 1rem;
  @media (max-width: ${DeviceWidths.sm}) {
    width: 15rem;
    height: 15rem;
  }
`;

export const PersonGamePage: FC = () => {
  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [showName, setShowName] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const increaseCounter = () => {
    setCounter((prev) => prev + 1);
  };

  useEffect(() => {
    //todo: waiter og error
    setShowName(false);
    const getRandomPersonAsync = async () => {
      setPerson(await getRandomPerson());
    };
    getRandomPersonAsync().then();
  }, [counter]);

  return (
    <PageWrapper>
      {person && (
        <StyledCard>
          <StyledCardContent>
            <StyledImage
              alt="Person"
              src={person.imageName ? `${PERSON_IMAGE_URL}${person.imageName}` : personPlaceholderImage}
              //onError={(event: any) => (event.target.src = personPlaceholderImage)}
            />
            {showName ? (
              <Typography fontSize={'2rem'}>
                {person.firstName} {person.lastName}
              </Typography>
            ) : (
              <Button onClick={() => setShowName(true)}>Show me!</Button>
            )}
          </StyledCardContent>
          <StyledCardActions>
            <Link to={`/person/${person.id}`}>
              <Button>View person</Button>
            </Link>
            <Button onClick={increaseCounter} variant="contained">
              One more ...
            </Button>
          </StyledCardActions>
        </StyledCard>
      )}
    </PageWrapper>
  );
};
