import { CircularProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getPersonsParents, getPersonsChildren, removeRelation } from '../api/api';
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
  const [apiError, setApiError] = useState<Error | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const asyncApiCalls = async () => {
      if (person?.id) {
        setParents(await getPersonsParents(person.id, setApiError, setIsLoading));
        setChildren(await getPersonsChildren(person.id, setApiError, setIsLoading));
      }
    };
    asyncApiCalls();
  }, [person]);

  const deleteRole = async (relationPersonId: string, roleId: number) => {
    await removeRelation(person.id, relationPersonId, roleId, setApiError, setIsDeleting);
    //TODO: remove from list
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Relasjoner
      </Typography>
      {isLoading && <CircularProgress color="inherit" size={'2rem'} />}
      {isDeleting && <CircularProgress color="inherit" size={'2rem'} />}
      {apiError && <ErrorAlert errorMessage={apiError.message}></ErrorAlert>}
      {parents.length > 0 && (
        <RelationPersonListComponent
          headerText={'Foreldre'}
          persons={parents}
          handleDeleteClick={(relationPersonId: string) => deleteRole(relationPersonId, RelationshipRole.Child)}
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
