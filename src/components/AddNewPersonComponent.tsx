import { FC, useState } from 'react';
import { Button, CircularProgress, TextField, Card, Alert, AlertTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddAPhoto from '@mui/icons-material/AddAPhoto';
import { emptyPerson, Person } from '../types/person';
import styled from '@emotion/styled';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { addPerson } from '../api/api';
import { ErrorAlert } from './ErrorAlert';
import { DeviceWidths } from '../theme';

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
`;

const StyledDoubleFieldWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledActionAreaWrapper = styled.div`
  margin: 0 1rem 1rem 5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 1rem;
`;

const StyledAddImageWrapper = styled.div`
  height: 6rem;
  width: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed lightgray;
`;
interface Props {
  addNewPersonFormToPage: () => void;
}
export const AddNewPersonComponent: FC<Props> = ({ addNewPersonFormToPage }) => {
  const [savingError, setSavingError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [personId, setPersonId] = useState<string>('');

  const handleSave = async (values: Person) => {
    const result = await addPerson(values, setSavingError, setIsSaving);
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
              />
              <StyledDoubleFieldWrapper>
                <Field name={'firstName'}>
                  {({ field }: FieldProps) => <StyledTextField {...field} label="Fornavn" variant="outlined" />}
                </Field>
                <Field name={'lastName'}>
                  {({ field }: FieldProps) => <StyledTextField {...field} label="Etternavn" variant="outlined" />}
                </Field>
              </StyledDoubleFieldWrapper>
              <StyledDoubleFieldWrapper>
                <Field name={'facebookLink'}>
                  {({ field }: FieldProps) => <StyledTextField {...field} label="Facebook-id" variant="outlined" />}
                </Field>
                <Field name={'note'}>
                  {({ field }: FieldProps) => <StyledTextField {...field} label="Kommentar" variant="outlined" />}
                </Field>
              </StyledDoubleFieldWrapper>
            </div>

            <StyledActionAreaWrapper>
              <StyledAddImageWrapper>
                <IconButton
                  disabled={!personId}
                  size="large"
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input hidden accept="image/*" type="file" />
                  <AddAPhoto fontSize="large" />
                </IconButton>
              </StyledAddImageWrapper>

              <Button disabled={isSaving || !!personId} type="submit" color="primary" variant="contained">
                Lagre {isSaving && <CircularProgress color="inherit" size={'1rem'} sx={{ ml: 2 }} />}
              </Button>
              {savingError && <ErrorAlert errorMessage={savingError}></ErrorAlert>}
            </StyledActionAreaWrapper>
          </StyledForm>
        )}
      </Formik>
      {personId && (
        <Alert severity="success">
          <AlertTitle>Personen er lagret</AlertTitle>
        </Alert>
      )}
    </StyledCard>
  );
};
