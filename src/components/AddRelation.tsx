import styled from '@emotion/styled';
import {
  Autocomplete,
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { addRelation, queryPersons } from '../api/api';
import { PERSON_THUMBNAIL_URL } from '../constants';
import { Person, RelationshipRole } from '../types/person';
import { ErrorAlert } from './ErrorAlert';

const ComponentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FormWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 1rem;
`;

const RelationRolesOptions = [
  { label: 'Barn', value: RelationshipRole.Child },
  { label: 'Forelder', value: RelationshipRole.Parent },
  { label: 'Partner', value: RelationshipRole.Partner },
  { label: 'Søsken', value: RelationshipRole.Sibling },
  { label: 'Kollega', value: RelationshipRole.Collegue },
];

interface Props {
  personId: string;
  retrievAllRelations: any;
}

export const AddRelation: FC<Props> = ({ personId, retrievAllRelations }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [options, setOptions] = useState<Person[]>([]);
  const [selectedRole, setSelectedRole] = useState(2);
  const [queryValue, setQueryValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (queryValue?.length > 1) {
        const response = await queryPersons(queryValue, setLoadingError, setIsLoading);
        response && response.persons?.length > 0 && setOptions(response.persons);
      }
    })();
  }, [queryValue]);

  const handleRelationValueChange = (event: any) => {
    console.log('selected role', event.target.value);
    setSelectedRole(event.target.value as number);
  };

  const handleClick = async () => {
    if (selectedPerson) {
      await addRelation(selectedPerson.id, personId, selectedRole, setSavingError, setIsSaving);
      setSelectedPerson(null);
      retrievAllRelations();
    }
  };

  return (
    <ComponentWrapper>
      <FormWrapper>
        <span>Legg til :</span>
        <FormControl>
          <div>
            <Autocomplete
              style={{ minWidth: '13rem' }}
              options={options}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions
              getOptionLabel={(option) => `${option.firstName} ${option.lastName} `}
              onInputChange={(event, newInputValue) => {
                setQueryValue(newInputValue);
              }}
              onChange={(event: any, newValue: Person | null) => {
                setSelectedPerson(newValue);
              }}
              loading={isLoading}
              renderOption={(props, person: Person) => (
                <li {...props}>
                  <StyledAvatar alt={person.lastName} src={`${PERSON_THUMBNAIL_URL}${person.imageName}`} />
                  {` ${person.firstName} ${person.lastName}`}
                </li>
              )}
              // renderOption={(props, option) => [props, option] as React.ReactNode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>
        </FormControl>
        <span> som </span>
        <FormControl>
          <Select id="role-select" displayEmpty value={selectedRole} onChange={handleRelationValueChange}>
            {RelationRolesOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button disabled={!selectedPerson || isSaving} onClick={handleClick} variant="contained" color="primary">
          Go!
        </Button>
        {isSaving && <CircularProgress color="inherit" size={'1rem'} />}
      </FormWrapper>
      {loadingError && <ErrorAlert errorMessage={loadingError}></ErrorAlert>}
      {savingError && <ErrorAlert errorMessage={savingError}></ErrorAlert>}
    </ComponentWrapper>
  );
};
