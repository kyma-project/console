import { useState, useContext } from 'react';
import createContainer from 'constate';

import { ConfigurationsService } from './index';

import { HELM_BROKER_IS_DEVELOPMENT_MODE, ERRORS } from '../constants';
const URL_ERRORS = ERRORS.URL;

const useUrls = () => {
  const { originalConfigs } = useContext(ConfigurationsService);
  let timer: number = 0;

  const getUrlsFromConfigByName = (configName: string): string[] => {
    const config = originalConfigs.find(config => config.name === configName);
    return config ? config.urls : [];
  };

  const validateUrl = (url: string, existingUrls: string[]): string => {
    if (existingUrls.includes(url)) {
      return URL_ERRORS.ALREADY_EXISTS;
    }
    if (HELM_BROKER_IS_DEVELOPMENT_MODE) {
      if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        return URL_ERRORS.STARTS_WITH_HTTP.DEVELOPMENT_MODE;
      }
    } else {
      if (!url.startsWith('https://')) {
        return URL_ERRORS.STARTS_WITH_HTTP.NOT_DEVELOPMENT_MODE;
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
