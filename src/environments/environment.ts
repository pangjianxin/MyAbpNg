import { Config } from '@abp/ng.core';


const baseUrl = 'http://localhost:4201';

export const environment: Config.Environment = {
  production: false,
  application: {
    baseUrl,
    name: 'Lbfl',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44384',
    redirectUri: baseUrl,
    clientId: 'Lbfl_App2',
    responseType: 'code',
    scope: 'offline_access Lbfl',
  },
  apis: {
    default: {
      url: 'https://localhost:44384',
      rootNamespace: 'Boc.Lbfl',
    },
  },
} as Config.Environment;
