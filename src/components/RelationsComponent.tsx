import { CircularProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getPersonsParents, getPersonsChildren } from '../api/api';
import { Person, RelationshipRole } from '../types/person';
import { AddRelation } from './AddRelation';
import { ErrorAlert } from './ErrorAlert';
import { RelationPersonListComponent } from './RoleListComponent';

interface Props {
  person: Person;
}

export const RelationsComponent: FC<Props> = ({ person }) => {
  const [parents, setParents] = useState<Person[]>([]);
  const [children, setChildren] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncApiCalls = async () => {
      if (person?.id) {
        setParents(await getPersonsParents(person.id, setLoadingError, setIsLoading));
        setChildren(await getPersonsChildren(person.id, setLoadingError, setIsLoading));
      }
    };
    asyncApiCalls();
  }, [person]);

  const deleteRole = (relationPersonId: string, roleId: number) => {
    console.log('deleting role' + relationPersonId + ' : ' + roleId + ' : ' + person.id);

    //delete(person.id, relationPersonId, roleId);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Relasjoner
      </Typography>
      {isLoading && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingError && <ErrorAlert errorMessage={loadingError.message}></ErrorAlert>}
      {parents.length > 0 && (
        <RelationPersonListComponent
          headerText={'Foreldre'}
          persons={parents}
          handleDeleteClick={(relationPersonId: string) => deleteRole(relationPersonId, RelationshipRole.Parent)}
        />
      )}
      {children.length > 0 && (
        <RelationPersonListComponent
          headerText={'Barn'}
          persons={children}
          handleDeleteClick={(relationPersonId: string) => deleteRole(relationPersonId, RelationshipRole.Parent)}
        />
      )}
      <AddRelation personId={person?.id}></AddRelation>
    </>
  );
};
