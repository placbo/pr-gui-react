import { FC, useEffect, useState } from 'react';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';

import { Community, emptyCommunity } from '../types/community';
import styled from '@emotion/styled';
import { Field, FieldProps, Form, Formik } from 'formik';
import { addCommunity, getCommunity, updateCommunity } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/ErrorAlert';

const EditPage = styled.div`
  padding: 0 1rem;
  max-width: 50rem;
  margin-top: 2rem;
`;

const StyledTextField = styled(TextField)`
  margin: 1rem 0;
`;

export const EditCommunityPage: FC = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const [savingError, setSavingError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [loadingCommunityError, setLoadingCommunityError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const asyncFunc = async () => {
      communityId
        ? setCommunity(await getCommunity(communityId, setLoadingCommunityError, setIsLoadingCommunity))
        : setCommunity(emptyCommunity);
    };
    asyncFunc();
  }, [communityId]);

  const handleSave = async (values: Community) => {
    console.log('saving community', values);
    if (communityId) {
      await updateCommunity(communityId, values, setSavingError, setIsSaving);
      navigate('/community/' + communityId);
    } else {
      await addCommunity(values, setSavingError, setIsSaving);
      navigate('/communities');
    }
  };

  return (
    <EditPage>
      {isLoadingCommunity && <CircularProgress color="inherit" size={'2rem'} />}
      {loadingCommunityError && <ErrorAlert errorMessage={loadingCommunityError.message}></ErrorAlert>}
      {community && (
        <>
          <Formik onSubmit={handleSave} initialValues={community}>
            {() => (
              <Form>
                <Typography variant="h4">{communityId ? 'Endre gruppe' : 'Lag ny gruppe'}</Typography>
                <div>
                  <Field name={'name'}>
                    {({ field }: FieldProps) => (
                      <StyledTextField {...field} fullWidth label="Navn på gruppe" variant="outlined" />
                    )}
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
        </>
      )}
    </EditPage>
  );
};
