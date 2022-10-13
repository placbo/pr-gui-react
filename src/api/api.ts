import { COMMUNITIES_URL, PERSONS_URL } from '../constants';
import axios from 'axios';
import useSWR from 'swr';
import { NUMBER_PR_PAGE_PARAM, QUERY_PARAM, SORT_DESCENDING, SORT_PARAM } from '../types/QueryParams';
import { Person } from '../types/person';
import { axiosDeleteHandler, axiosGetHandler, axiosPostHandler, axiosPutHandler } from './apiUtils';
import { Dispatch, SetStateAction } from 'react';

export const getPerson = async (personId: string, setError: any, setLoading: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(`${PERSONS_URL}/${personId}`, setError, setLoading);
};

export const getRandomPerson = async (setError?: any, setLoading?: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(`${PERSONS_URL}/random`, setError, setLoading);
};

export const getPersons = async (max: number, setError: any, setLoading: Dispatch<SetStateAction<boolean>>) => {
  return axiosGetHandler(
    `${PERSONS_URL}?${SORT_PARAM}=${SORT_DESCENDING}&${NUMBER_PR_PAGE_PARAM}=${max}`,
    setError,
    setLoading
  );
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

export const addPerson = async (person: Person, setError: any, setSaving: any) => {
  return axiosPostHandler(`${PERSONS_URL}`, person, setError, setSaving);
};

export const updatePerson = async (personId: string, person: Person, setError: any, setSaving: any) => {
  axiosPutHandler(`${PERSONS_URL}/${personId}`, person, setError, setSaving);
};

export const deletePerson = async (personId: string, setError?: any, setDeleting?: any) => {
  axiosDeleteHandler(`${PERSONS_URL}/${personId}`, setError, setDeleting);
};

export const getCommunity = async (
  communityId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${COMMUNITIES_URL}/${communityId}`, setError, setLoading);
};

export const getPersonsInCommunity = async (
  communityId: string,
  setError: any,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  return axiosGetHandler(`${COMMUNITIES_URL}/${communityId}/persons`, setError, setLoading);
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
