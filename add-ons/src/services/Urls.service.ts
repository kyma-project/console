import { useState, useContext } from 'react';
import createContainer from 'constate';

import { ConfigurationsService } from './index';

import { HELM_BROKER_REPO_URL_PREFIXES, ERRORS } from '../constants';
const URL_ERRORS = ERRORS.URL;

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

    if (
      !HELM_BROKER_REPO_URL_PREFIXES.some((prefix: string) =>
        url.startsWith(prefix),
      )
    ) {
      return URL_ERRORS.WRONG_PREFIX;
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
