import { Dispatch, SetStateAction } from 'react';

import axios from 'axios';
import useSWR from 'swr';

import { Category } from '../components/ChangeMainImageComponent';
import { COMMUNITIES_URL, IMAGE_UPLOAD_URL, IMAGE_URL, PERSONS_URL } from '../constants';
import { Person } from '../types/person';
import {
  IS_MAIN_IMAGE,
  NUMBER_PR_PAGE_PARAM,
  QUERY_PARAM,
  SHOW_COMMUNITIES_PARAM,
  SORT_DESCENDING,
  SORT_PARAM,
} from '../types/QueryParams';
import { Community } from './../types/community';
import { axiosDeleteHandler, axiosGetHandler, axiosPostHandler, axiosPutHandler } from './apiUtils';

export const getPerson = async (personId: string, setError: any, setLoading: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(`${PERSONS_URL}/${personId}`, setError, setLoading);
};

export const getRandomPerson = async (setError?: any, setLoading?: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(`${PERSONS_URL}/random`, setError, setLoading);
};

export const getPersons = async (
  max: number,
  showcommunities: boolean,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(
    `${PERSONS_URL}?${SORT_PARAM}=${SORT_DESCENDING}&${SHOW_COMMUNITIES_PARAM}=${showcommunities}&${NUMBER_PR_PAGE_PARAM}=${max}`,
    setError,
    setLoading
  );
};

export const queryPersons = async (query: string, setError?: any, setLoading?: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(`${PERSONS_URL}?${QUERY_PARAM}=${query}`, setError, setLoading);
};

//TODO: endre any til riktige type (mrk flere forskjellige error-objekter)
export const getPersonsParents = async (
  personId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${PERSONS_URL}/${personId}/parents`, setError, setLoading);
};

export const getPersonsChildren = async (
  personId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${PERSONS_URL}/${personId}/children`, setError, setLoading);
};

export const getPersonsImages = async (
  personId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${PERSONS_URL}/${personId}/images`, setError, setLoading);
};

export const addPerson = async (person: Person, setError: any, setSaving: any) => {
  return axiosPostHandler(`${PERSONS_URL}`, person, setError, setSaving);
};

export const updatePerson = async (personId: string, person: Person, setError: any, setSaving: any) => {
  axiosPutHandler(`${PERSONS_URL}/${personId}`, person, setError, setSaving);
};

export const deletePerson = async (personId: string, setError?: any, setDeleting?: any) => {
  axiosDeleteHandler(`${PERSONS_URL}/${personId}`, setError, setDeleting);
};

export const addRelation = async (
  fromPersonId: string,
  toPersonId: string,
  roleId: number,
  setError: any,
  setSaving: any
) => {
  return axiosPostHandler(`${PERSONS_URL}/connect/${fromPersonId}/${toPersonId}/${roleId}`, null, setError, setSaving);
};

export const removeRelation = async (
  fromPersonId: string,
  toPersonId: string,
  roleId: number,
  setError: any,
  setDeleting: any
) => {
  return axiosDeleteHandler(`${PERSONS_URL}/connect/${fromPersonId}/${toPersonId}/${roleId}`, setError, setDeleting);
};

export const removeImage = async (imageId: string, setError: any, setDeleting: any) => {
  return axiosDeleteHandler(`${IMAGE_URL}/${imageId}`, setError, setDeleting);
};

export const getCommunity = async (
  communityId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${COMMUNITIES_URL}/${communityId}`, setError, setLoading);
};

export const addCommunity = async (community: Community, setError: any, setSaving: any) => {
  return axiosPostHandler(`${COMMUNITIES_URL}`, community, setError, setSaving);
};

export const deleteCommunity = async (CommunityId: string, setError?: any, setDeleting?: any) => {
  axiosDeleteHandler(`${COMMUNITIES_URL}/${CommunityId}`, setError, setDeleting);
};

export const updateCommunity = async (communityId: string, community: Community, setError: any, setSaving: any) => {
  return axiosPutHandler(`${COMMUNITIES_URL}/${communityId}`, community, setError, setSaving);
};

export const getPersonsInCommunity = async (
  communityId: string,
  showcommunities: boolean,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(
    `${COMMUNITIES_URL}/${communityId}/persons?${SHOW_COMMUNITIES_PARAM}=${showcommunities}`,
    setError,
    setLoading
  );
};

export const getAllCommunities = async (setError: any, setLoading: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(`${COMMUNITIES_URL}`, setError, setLoading);
};

export const getCommunitiesForPerson = async (
  personId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${PERSONS_URL}/${personId}/communities`, setError, setLoading);
};

export const addPersonToCommunity = async (personId: string, communityId: string, setError: any, setSaving: any) => {
  return axiosPostHandler(`${COMMUNITIES_URL}/${communityId}/person/${personId}`, {}, setError, setSaving);
};

export const removePersonFromCommunity = async (
  personId: string,
  communityId: string,
  setError: any,
  setSaving: any
) => {
  return axiosDeleteHandler(`${COMMUNITIES_URL}/${communityId}/person/${personId}`, setError, setSaving);
};

export const uploadImage = async (
  file: File,
  id: string,
  category: Category,
  setError?: any,
  setUploading?: Dispatch<SetStateAction<boolean>>
): Promise<string | undefined> => {
  setUploading && setUploading(true);
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', id);
    formData.append('category', category);
    const result = await axios.post(`${IMAGE_UPLOAD_URL}?${IS_MAIN_IMAGE}=true`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'X-Auth-Token': localStorage.getItem('token') ?? '' },
    });
    return result.data.filename;
  } catch (error) {
    setError && setError(error);
  } finally {
    setUploading && setUploading(false);
  }
};

//-------------- SWR --

export const SWRfetcher = (url: string) =>
  axios
    .get(url, {
      headers: {
        'X-Auth-Token': localStorage.getItem('token') ?? '',
      },
    })
    .then((res) => res.data);

export const usePersonsQuery = (query: string | null) => {
  const { data, error } = useSWR(query ? `${PERSONS_URL}?${QUERY_PARAM}=${query}` : null, SWRfetcher);
  return {
    persons: data?.persons,
    isLoading: !error && !data && query,
    loadingError: error,
  };
};
