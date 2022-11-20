import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Card, Alert, AlertTitle } from '@mui/material';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';

import { addPerson } from '../api/api';
import { DeviceWidths } from '../theme';
import { emptyPerson, Person } from '../types/person';
import { AddImageComponent } from './AddImageComponent';
import { ErrorAlert } from './ErrorAlert';

const StyledCard = styled(Card)`
  padding: 1rem;
  margin-top: 2rem;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: row;
  @media (max-width: ${DeviceWidths.sm}) {
    flex-wrap: wrap;
  }
`;

const StyledTextField = styled(TextField)`
  width: 15rem;
  @media (max-width: ${DeviceWidths.sm}) {
    width: 100%;
  }
`;

const StyledDoubleFieldWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledActionAreaWrapper = styled.div`
  margin: 0 2rem 0 3rem;
  padding-left: 3rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  @media (max-width: ${DeviceWidths.sm}) {
    flex-direction: row;
    margin: 1rem 0 0 0;
    padding: 1rem 0 0 0;
    width: 100%;
    border: none;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
`;

interface Props {
  addNewPersonFormToPage: () => void;
}
export const AddNewPersonComponent: FC<Props> = ({ addNewPersonFormToPage }) => {
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [personId, setPersonId] = useState<string>('');

  const handleSave = async (values: Person) => {
    const result = await addPerson(values, setError, setIsSaving);
    setPersonId(result.id);
    addNewPersonFormToPage();
  };

  const onFullNameBlur = (event: any, props: FormikProps<Person>): void => {
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
    <StyledCard variant="outlined">
      <Formik onSubmit={handleSave} initialValues={emptyPerson}>
        {(props) => (
          <StyledForm>
            <div>
              <StyledTextField
                fullWidth
                helperText="Feltet blir bare brukt for å generere for- og etternavn"
                label="Full Name"
                variant="outlined"
                onBlur={(event) => onFullNameBlur(event, props)}
                disabled={isSaving || !!personId}
              />
              <StyledDoubleFieldWrapper>
                <Field name={'firstName'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField {...field} label="Fornavn" variant="outlined" disabled={isSaving || !!personId} />
                  )}
                </Field>
                <Field name={'lastName'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField
                      {...field}
                      label="Etternavn"
                      variant="outlined"
                      disabled={isSaving || !!personId}
                    />
                  )}
                </Field>
              </StyledDoubleFieldWrapper>
              <StyledDoubleFieldWrapper>
                <Field name={'facebookLink'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField
                      {...field}
                      label="Facebook-id"
                      variant="outlined"
                      disabled={isSaving || !!personId}
                    />
                  )}
                </Field>
                <Field name={'note'}>
                  {({ field }: FieldProps) => (
                    <StyledTextField
                      {...field}
                      label="Kommentar"
                      variant="outlined"
                      disabled={isSaving || !!personId}
                    />
                  )}
                </Field>
              </StyledDoubleFieldWrapper>
              <Button disabled={isSaving || !!personId} type="submit" color="primary" variant="contained">
                Lagre {isSaving && <CircularProgress color="inherit" size={'1rem'} sx={{ ml: 2 }} />}
              </Button>
              {error && <ErrorAlert errorMessage={error}></ErrorAlert>}
            </div>
            <StyledActionAreaWrapper>
              <AddImageComponent personId={personId} setError={setError}></AddImageComponent>
            </StyledActionAreaWrapper>
          </StyledForm>
        )}
      </Formik>
      {personId && (
        <Alert severity="success" sx={{ mt: '1rem' }}>
          <AlertTitle>
            Personen er lagret! <Link to={`/editperson/${personId}`}>Rediger person</Link>
          </AlertTitle>
        </Alert>
      )}
    </StyledCard>
  );
};
