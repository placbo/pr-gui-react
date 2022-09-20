import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  CircularProgress,
  DialogTitle,
  Divider,
  TextField,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { emptyPerson, Person } from '../types/person';
import styled from '@emotion/styled';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { addPerson, updatePerson } from './api';
import axios from 'axios';

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

const StyledTextField = styled(TextField)`
  margin: 1rem 0;
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 1rem;
  color: red;
`;

const StyledAlert = styled(Alert)`
  margin-top: 2rem;
`;

interface editDialogProps {
  isEditDialogOpen: boolean;
  handleToggleDialog: any;
  person?: Person;
  setPerson?: any;
}

const EditPersonDialog: FC<editDialogProps> = ({ isEditDialogOpen, handleToggleDialog, person, setPerson }) => {
  const [savingError, setSavingError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = (values: Person) => {
    setIsSaving(true);
    setSavingError('');
    try {
      person?.id ? updatePerson(person.id, values) : addPerson(values);
      handleToggleDialog();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSavingError(error.message);
      }
    }
    setIsSaving(false);
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
    <Dialog
      open={isEditDialogOpen}
      onClose={handleToggleDialog}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth={'sm'}
      id="edit_dialog"
    >
      <Formik onSubmit={handleSave} initialValues={person ?? emptyPerson}>
        {(props) => (
          <Form>
            {!person?.id ? <DialogTitle>Ny person</DialogTitle> : <DialogTitle>Endre person</DialogTitle>}
            <StyledDialogContent>
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
                {({ field }: FieldProps) => <StyledTextField {...field} fullWidth label="Fornavn" variant="outlined" />}
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
              <Field name={'deceased'}>
                {({ field }: FieldProps) => <StyledTextField {...field} fullWidth label="Død" variant="outlined" />}
              </Field>
              <Field name={'note'}>
                {({ field }: FieldProps) => (
                  <StyledTextField {...field} multiline rows="3" fullWidth label="Kommentar" variant="outlined" />
                )}
              </Field>
              {isSaving && <CircularProgress size={'1rem'} />}
              {savingError && (
                <StyledAlert severity="error">
                  <AlertTitle>En feil har oppstått!</AlertTitle>
                  {savingError}
                </StyledAlert>
              )}
            </StyledDialogContent>
            <DialogActions>
              <Button onClick={handleToggleDialog}>Angre</Button>
              <Button type="submit" color="primary" variant="contained">
                Lagre
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditPersonDialog;
