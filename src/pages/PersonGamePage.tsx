import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { Button, Card, CardContent, Typography } from '@mui/material';

import { getRandomPerson, getRandomPersonFromCommunity } from '../api/api';
import { SelectCommunityDialog } from '../components/SelectCommunityDialog';
import { PERSON_IMAGE_URL } from '../constants';
import personPlaceholderImage from '../resources/images/person.png';
import { Colors, DeviceWidths } from '../theme';
import { Person } from '../types/person';

const PageWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ActionWrapper = styled.div`
  margin: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 25rem;
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

  const [isSelectCommunityDialogOpen, setIsSelectCommunityDialogOpen] = useState(false);

  const [selectedCommunitiyId, setSelectedCommunityId] = useState('');
  const [selectedCommunitiyName, setSelectedCommunityName] = useState('');

  const increaseCounter = () => {
    setCounter((prev) => prev + 1);
  };

  useEffect(() => {
    setShowName(false);
    const getRandomPersonAsync = async () => {
      setPerson(
        selectedCommunitiyId ? await getRandomPersonFromCommunity(selectedCommunitiyId) : await getRandomPerson()
      );
    };
    getRandomPersonAsync().then();
  }, [counter, selectedCommunitiyId]);

  const handleSelectedCommunity = (communityId?: string, name?: string) => {
    setIsSelectCommunityDialogOpen(false);
    if (communityId) {
      setSelectedCommunityId(communityId);
      name && setSelectedCommunityName(name);
    }
  };

  return (
    <PageWrapper>
      <ActionWrapper>
        {selectedCommunitiyName && <div>{selectedCommunitiyName}</div>}
        <Button onClick={() => setIsSelectCommunityDialogOpen(true)}>
          {selectedCommunitiyId ? 'Velg annen gruppe' : 'Avgrens på gruppe'}
        </Button>
      </ActionWrapper>
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
      <SelectCommunityDialog open={isSelectCommunityDialogOpen} onClose={handleSelectedCommunity} />
    </PageWrapper>
  );
};
