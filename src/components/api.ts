import { COMMUNITIES_URL, PERSONS_URL } from '../constants';
import axios from 'axios';
import useSWR from 'swr';
import { QUERY_PARAM } from '../types/QueryParams';

export const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: {
        'X-Auth-Token': localStorage.getItem('token') ?? '',
      },
    })
    .then((res) => res.data);

export const useCommunities = () => {
  const { data, error } = useSWR(`${COMMUNITIES_URL}`, fetcher);
  return {
    communities: data,
    isLoading: !error && !data,
    loadingError: error,
  };
};

export const useCommunitiesForPerson = (personId: string) => {
  const { data, error } = useSWR(`${PERSONS_URL}\\${personId}\\communities`, fetcher);
  return {
    communities: data,
    isLoading: !error && !data,
    loadingError: error,
  };
};

export const usePersonsQuery = (query: string | null) => {
  const { data, error } = useSWR(query ? `${PERSONS_URL}?${QUERY_PARAM}=${query}` : null, fetcher);
  return {
    persons: data?.persons,
    isLoading: !error && !data && query,
    loadingError: error,
  };
};
