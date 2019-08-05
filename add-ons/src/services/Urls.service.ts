import { useState, useContext } from 'react';
import createContainer from 'constate';

import { ConfigurationsService } from './index';

import { HELM_BROKER_IS_DEVELOPMENT_MODE, ERRORS } from '../constants';
const URL_ERRORS = ERRORS.URL;

const HTTP_PROTOCOL = 'http://';
const HTTPS_PROTOCOL = 'https://';
const GIT_PREFIX = 'git::';
const GITHUB_PREFIX = 'github.com/';
const BITBUCKET_PREFIX = 'bitbucket.org/';

const DEVELOPMENT_MODE_PREFIXES = [
  HTTP_PROTOCOL,
  HTTPS_PROTOCOL,
  GIT_PREFIX,
  GITHUB_PREFIX,
  BITBUCKET_PREFIX,
];
const PRODUCTION_MODE_PREFIXES = [
  HTTPS_PROTOCOL,
  GIT_PREFIX,
  GITHUB_PREFIX,
  BITBUCKET_PREFIX,
];

const useUrls = () => {
  const { originalConfigs } = useContext(ConfigurationsService);

  const getUrlsFromConfigByName = (configName: string): string[] => {
    const config = originalConfigs.find(c => c.name === configName);
    return config ? config.urls : [];
  };

  const validateUrl = (url: string, existingUrls: string[]): string => {
    if (existingUrls.includes(url)) {
      return URL_ERRORS.ALREADY_EXISTS;
    }
    if (HELM_BROKER_IS_DEVELOPMENT_MODE) {
      if (!DEVELOPMENT_MODE_PREFIXES.some(prefix => url.startsWith(prefix))) {
        return URL_ERRORS.STARTS_WITH_HTTP.DEVELOPMENT_MODE;
      }
    } else {
      if (!PRODUCTION_MODE_PREFIXES.some(prefix => url.startsWith(prefix))) {
        return URL_ERRORS.STARTS_WITH_HTTP.PRODUCTION_MODE;
      }
    }
    return '';
  };

  return {
    getUrlsFromConfigByName,
    validateUrl,
  };
};

const { Provider, Context } = createContainer(useUrls);
export { Provider as UrlsProvider, Context as UrlsService };
