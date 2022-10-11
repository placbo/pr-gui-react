import { COMMUNITIES_URL } from './../constants';
import Axios, { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { PERSONS_URL } from '../constants';
import { mockPersons, mockCommunities, mockCommunity, mockPerson, mockParents, mockChildren } from './mocks';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // const mockGetDelayedAndLogged = (pathPattern: string, statusCode: number, mockedResponse: any, delay = 0) => {
  //   mock.onGet(new RegExp(pathPattern)).reply((config) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(loggedReply(config, statusCode, mockedResponse));
  //       }, delay);
  //     });
  //   });
  // };

  // const loggedReply = (config: AxiosRequestConfig, statusCode: number, mockedResult: unknown) => {
  //   /* eslint-disable no-console */
  //   console.log('MOCKED API-CALL: ', config.url);
  //   //console.log('MOCKED API-CALL: ', config, statusCode, mockedResult);
  //   return [statusCode, mockedResult];
  // };

  // mockGetDelayedAndLogged(`${PERSONS_URL}/1233/parents`, 200, mockPersons);
  // mock
  //   .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors`))
  //   .reply((config) => loggedReply(config, 202, createMockContributor()));

  mock.onGet(new RegExp(`${PERSONS_URL}/.*/communities`)).reply(200, mockCommunities);
  mock.onGet(new RegExp(`${PERSONS_URL}/.*/parents`)).reply(200, mockParents);
  mock.onGet(new RegExp(`${PERSONS_URL}/.*/children`)).reply(200, mockChildren);
  mock.onGet(new RegExp(`${PERSONS_URL}/.*`)).reply(200, mockPerson);
  mock.onGet(new RegExp(`${PERSONS_URL}`)).reply(200, mockPersons);
  mock.onGet(new RegExp(`${COMMUNITIES_URL}/.*/persons`)).reply(200, mockPersons);
  mock.onGet(new RegExp(`${COMMUNITIES_URL}/.*`)).reply(200, mockCommunity);
  mock.onGet(new RegExp(`${COMMUNITIES_URL}`)).reply(200, mockCommunities);
  mock.onPost(new RegExp(`${PERSONS_URL}`)).reply(200, { id: 123 });

  //MOCK NOT FOUND
  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
