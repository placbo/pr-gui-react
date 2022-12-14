import { FC, useCallback, useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@mui/material';

import { getPersonsParents, getPersonsChildren } from '../api/api';
import { Person, RelationshipRole } from '../types/person';
import { AddRelation } from './AddRelation';
import { ErrorAlert } from './ErrorAlert';
import { RelationPersonListComponent } from './RoleListComponent';

interface Props {
  person: Person;
}

export const ManageRelationsComponent: FC<Props> = ({ person }) => {
  const [parents, setParents] = useState<Person[]>([]);
  const [children, setChildren] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<Error | undefined>(undefined);

  const retrieveAllRelations = useCallback(() => {
    const asyncApiCalls = async () => {
      if (person?.id) {
        setParents(await getPersonsParents(person.id, setApiError, setIsLoading));
        setChildren(await getPersonsChildren(person.id, setApiError, setIsLoading));
      }
    };
    asyncApiCalls();
  }, [person.id]);

  useEffect(() => {
    retrieveAllRelations();
  }, [retrieveAllRelations]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Relasjoner
      </Typography>
      {isLoading && <CircularProgress color="inherit" size={'2rem'} />}
      {apiError && <ErrorAlert errorMessage={apiError.message}></ErrorAlert>}
      {parents.length > 0 && (
        <RelationPersonListComponent
          headerText={'Foreldre'}
          persons={parents}
          mainPerson={person}
          roleId={RelationshipRole.Parent}
          retrievAllRelations={retrieveAllRelations}
        />
      )}
      {children.length > 0 && (
        <RelationPersonListComponent
          headerText={'Barn'}
          persons={children}
          mainPerson={person}
          roleId={RelationshipRole.Child}
          retrievAllRelations={retrieveAllRelations}
        />
      )}

      <AddRelation personId={person?.id} retrievAllRelations={retrieveAllRelations}></AddRelation>
    </>
  );
};
