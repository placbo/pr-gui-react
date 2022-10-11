import React, { FC, useEffect, useState } from 'react';
import { Button, CircularProgress, Divider, TextField, Typography } from '@mui/material';

import { emptyPerson, Person } from '../types/person';
import styled from '@emotion/styled';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { addPerson, getPerson, updatePerson } from '../api/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorAlert } from '../components/ErrorAlert';

const EditPage = styled.div`
  padding: 0 1rem;
  max-width: 30rem;
  margin-top: 2rem;
`;

const StyledTextField = styled(TextField)`
  margin: 1rem 0;
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 1rem;
  color: red;
`;

export const EditPersonPage: FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const personId = searchParams.get('id');
  const [savingError, setSavingError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [isLoadingPerson, setIsLoadingPerson] = useState(false);
  const [loadingPersonError, setLoadingPersonError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      personId
        ? setPerson(await getPerson(personId, setIsLoadingPerson, setLoadingPersonError))
        : setPerson(emptyPerson);
    };
    asyncFunc();
  }, [personId]);

  const handleSave = async (values: Person) => {
    if (personId) {
      updatePerson(personId, values, setSavingError, setIsSaving);
      navigate('/person/' + personId);
    } else {
      const result = await addPerson(values, setSavingError, setIsSaving);
      navigate('/person/' + result.id);
    }
  };

  const onFullNameBlur = (event: any, props: FormikProps<Person>) => {
    const name = event.target.value;
    if (name.length > 0) {
      const upperCasedWords = name
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase());
      props.setFieldValue('lastName', upperCasedWords.pop());
      props.setFieldValue('firstName', upperCasedWords.join(' '));
    }
  };

  return (
    <EditPage>
      {isLoadingPerson && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingPersonError && (
        <Typography color="red" variant="body1">
          {loadingPersonError.message}
        </Typography>
      )}
      {person && (
        <Formik onSubmit={handleSave} initialValues={person}>
          {(props) => (
            <Form>
              <Typography variant="h4">{!person?.id ? 'Ny person' : 'Endre person'}</Typography>
              <div>
                {!person?.id && (
                  <>
                    <StyledTextField
                      fullWidth
                      helperText="Feltet blir bare brukt for å generere for- og etternavn"
                      label="Full Name"
                      variant="outlined"
                      onBlur={(event) => onFullNameBlur(event, props)}
                    />
                    <StyledDivider />
                  </>
                )}
                <Field name={'firstName'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField {...field} fullWidth label="Fornavn" variant="outlined" />
                  )}
                </Field>
                <Field name={'lastName'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField {...field} fullWidth label="Etternavn" variant="outlined" />
                  )}
                </Field>
                <Field name={'facebookLink'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField {...field} fullWidth label="Facebook-id" variant="outlined" />
                  )}
                </Field>
                <Field name={'born'}>
                  {({ field }: FieldProps) => <StyledTextField {...field} fullWidth label="Født" variant="outlined" />}
                </Field>{' '}
                <Field name={'dead'}>
                  {({ field }: FieldProps) => <StyledTextField {...field} fullWidth label="Død" variant="outlined" />}
                </Field>
                <Field name={'note'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField {...field} multiline rows="3" fullWidth label="Kommentar" variant="outlined" />
                  )}
                </Field>
                {isSaving && <CircularProgress size={'1rem'} />}
                {savingError && <ErrorAlert errorMessage={savingError}></ErrorAlert>}
              </div>
              <div>
                <Button type="submit" color="primary" variant="contained">
                  Lagre
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </EditPage>
  );
};
