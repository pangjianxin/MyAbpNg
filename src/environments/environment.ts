import { Config } from '@abp/ng.core';


const baseUrl = 'http://localhost:4200';

export const environment: Config.Environment = {
  production: false,
  application: {
    baseUrl,
    name: 'Lbfl_App',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44328',
    redirectUri: baseUrl,
    clientId: 'Lbfl_App',
    responseType: 'code',
    scope: 'offline_access Lbfl',
  },
  apis: {
    default: {
      url: 'https://localhost:44328',
      rootNamespace: 'Boc.Lbfl',
    },
  },
} as Config.Environment;
