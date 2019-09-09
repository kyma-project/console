import React, { useState, useContext } from 'react';

import { useInput } from '../../../services/Forms';
import {
  MutationsService,
  ConfigurationsService,
  UrlsService,
} from '../../../services';

import AddUrlModal from './AddUrlModal.component';

interface Props {
  configurationName?: string;
}

const AddUrlModalContainer: React.FunctionComponent<Props> = ({
  configurationName,
}) => {
  const {
    addAddonsConfigurationUrls: [addAddonsConfigurationUrls],
  } = useContext(MutationsService);
  const { configurationNames } = useContext(ConfigurationsService);
  const { getUrlsFromConfigByName, validateUrl } = useContext(UrlsService);

  const getConfigName = (): string => {
    let name: string;
    if (!configurationNameField.value) {
      name = configurationName ? configurationName : configurationNames[0];
    } else {
      name = configurationNameField.value;
    }

    return name;
  };
  const configurationNameField = useInput('');

  // Urls
  const [urls, setUrls] = useState<string[]>([]);
  const addUrl = () => {
    if (urlField.value) {
      setUrls(oldUrls => [...oldUrls, urlField.value]);
      urlField.cleanUpField();
    }
  };
  const removeUrl = (url: string) => {
    if (url) {
      setUrls(oldUrls => oldUrls.filter(u => u !== url));
    }
  };
  const setEmptyUrls = () => {
    setUrls([]);
  };
  const validateUrlField = (url: string): string => {
    if (!url) {
      urlField.cleanUpField();
      return '';
    }

    const existingUrls = [...getUrlsFromConfigByName(getConfigName()), ...urls];
    return validateUrl(url, existingUrls);
  };
  const handleEnterDownOnUrlField = (event: any) => {
    if (event.key === 'Enter' && !urlField.error) {
      addUrl();
    }
  };
  const urlField = useInput('', validateUrlField);

  const onSubmit = () => {
    let urlsToCreated: string[] = [...urls];
    if (urlField.value && urlField.valid) {
      urlsToCreated = [urlField.value, ...urlsToCreated];
    }

    addAddonsConfigurationUrls({
      variables: {
        name: getConfigName(),
        urls: urlsToCreated,
      },
    });
  };

  const resetFields = (): void => {
    urlField.cleanUpField();
    setEmptyUrls();
  };

  const onShowModal = () => {
    resetFields();
  };

  const configs = configurationName ? [configurationName] : configurationNames;

  return (
    <AddUrlModal
      configurationName={configurationName}
      configurations={configs}
      configurationNameField={configurationNameField}
      urlField={urlField}
      urls={urls}
      onSubmit={onSubmit}
      addUrl={addUrl}
      removeUrl={removeUrl}
      handleEnterDownOnUrlField={handleEnterDownOnUrlField}
      onShowModal={onShowModal}
    />
  );
};

export default AddUrlModalContainer;
