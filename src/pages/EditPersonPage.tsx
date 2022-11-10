import { FC, useEffect, useState } from 'react';
import { Button, CircularProgress, Divider, TextField, Typography } from '@mui/material';

import { Person } from '../types/person';
import styled from '@emotion/styled';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { getPerson, updatePerson } from '../api/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/ErrorAlert';
import { ManageRelationsComponent } from '../components/ManageRelationsComponent';
import { ChangeProfileImageComponent } from '../components/ChangeProfileImageComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ManageCommunitiesComponent } from '../components/ManageCommunityComponent';

const EditPage = styled.div`
  padding: 0 1rem;
  max-width: 50rem;
  margin-top: 2rem;
`;

const StyledTextField = styled(TextField)`
  margin: 1rem 0;
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 1rem;
`;

const Spacer = styled.div`
  height: 2rem;
`;

export const EditPersonPage: FC = () => {
  const navigate = useNavigate();
  const { personId } = useParams();
  const [savingError, setSavingError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [isLoadingPerson, setIsLoadingPerson] = useState(false);
  const [loadingPersonError, setLoadingPersonError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      personId && setPerson(await getPerson(personId, setLoadingPersonError, setIsLoadingPerson));
    };
    asyncFunc();
  }, [personId]);

  const handleSave = async (values: Person) => {
    if (personId) {
      updatePerson(personId, values, setSavingError, setIsSaving);
      navigate('/person/' + personId);
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
      {person && (
        <Button component={Link} to={`/person/${person.id}`} startIcon={<ArrowBackIcon />} sx={{ mb: '0.5rem' }}>
          Tilbake til personvisning
        </Button>
      )}
      {isLoadingPerson && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingPersonError && <ErrorAlert errorMessage={loadingPersonError.message}></ErrorAlert>}
      {person && (
        <>
          <ChangeProfileImageComponent person={person}></ChangeProfileImageComponent>
          <Formik onSubmit={handleSave} initialValues={person}>
            {(props) => (
              <Form>
                <Typography variant="h4">{'Endre person'}</Typography>
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
                    {({ field }: FieldProps) => (
                      <StyledTextField {...field} fullWidth label="Født" variant="outlined" />
                    )}
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
                    Lagre feltendringer
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <Divider sx={{ m: '2rem' }} />
          <ManageRelationsComponent person={person}></ManageRelationsComponent>
          <ManageCommunitiesComponent person={person}></ManageCommunitiesComponent>
          <Spacer></Spacer>
        </>
      )}
    </EditPage>
  );
};
