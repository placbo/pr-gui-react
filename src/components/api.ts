import { COMMUNITIES_URL, PERSONS_URL } from '../constants';
import axios from 'axios';
import useSWR from 'swr';
import { NUMBER_PR_PAGE_PARAM, QUERY_PARAM, SORT_DESCENDING, SORT_PARAM } from '../types/QueryParams';
import { Person } from '../types/person';

const axiosConfigWithToken = {
  headers: { 'X-Auth-Token': localStorage.getItem('token') ?? '' },
};

export const SWRfetcher = (url: string) =>
  axios
    .get(url, {
      headers: {
        'X-Auth-Token': localStorage.getItem('token') ?? '',
      },
    })
    .then((res) => res.data);

export const useCommunities = () => {
  const { data, error } = useSWR(`${COMMUNITIES_URL}`, SWRfetcher);
  return {
    communities: data,
    isLoading: !error && !data,
    loadingError: error,
  };
};

export const useCommunitiesForPerson = (personId: string) => {
  const { data, error } = useSWR(`${PERSONS_URL}\\${personId}\\communities`, SWRfetcher);
  return {
    communities: data,
    isLoading: !error && !data,
    loadingError: error,
  };
};

export const getPerson = async (personId: string, setError: any, setLoading: any) => {
  setLoading(true);
  try {
    const result = (
      await axios.get(`${PERSONS_URL}\\${personId}`, {
        headers: {
          'X-Auth-Token': localStorage.getItem('token') ?? '',
        },
      })
    ).data;
    return result;
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export const getPersons = async (max: number, setError: any, setLoading: any) => {
  setLoading(true);
  try {
    const result = (
      await axios.get(`${PERSONS_URL}?${SORT_PARAM}=${SORT_DESCENDING}&${NUMBER_PR_PAGE_PARAM}=${max}`, {
        headers: {
          'X-Auth-Token': localStorage.getItem('token') ?? '',
        },
      })
    ).data;
    return result;
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export const usePerson = (personId: string | null | undefined) => {
  const { data, error } = useSWR(personId ? `${PERSONS_URL}/${personId}` : null, SWRfetcher);
  return {
    person: data,
    isLoading: !error && !data && personId,
    loadingError: error,
  };
};

export const usePersonParents = (personId: string | null | undefined) => {
  const { data, error } = useSWR(personId ? `${PERSONS_URL}/${personId}/parents` : null, SWRfetcher);
  return {
    parents: data,
    isLoading: !error && !data && personId,
    loadingError: error,
  };
};

export const usePersonChildren = (personId: string | null | undefined) => {
  const { data, error } = useSWR(personId ? `${PERSONS_URL}/${personId}/children` : null, SWRfetcher);
  return {
    children: data,
    isLoading: !error && !data && personId,
    loadingError: error,
  };
};

export const usePersonsQuery = (query: string | null) => {
  const { data, error } = useSWR(query ? `${PERSONS_URL}?${QUERY_PARAM}=${query}` : null, SWRfetcher);
  return {
    persons: data?.persons,
    isLoading: !error && !data && query,
    loadingError: error,
  };
};

export const addPerson = async (person: Person) => {
  await axios.post(`${PERSONS_URL}`, person, axiosConfigWithToken);
};

export const updatePerson = async (personId: string, person: Person) => {
  await axios.put(`${PERSONS_URL}/${personId}`, person, axiosConfigWithToken);
};

export const deletePerson = async (personId: string) => {
  await axios.delete(`${PERSONS_URL}/${personId}`, axiosConfigWithToken);
};
