import React, { useState, useContext } from 'react';

import { useInput } from '../../../services/Forms';
import {
  QueriesService,
  MutationsService,
  ConfigurationsService,
  LabelsService,
  UrlsService,
} from '../../../services';
import { ConfigurationLabels } from '../../../types';

import Component from './AddNewConfigurationModal.component';

const AddNewConfigurationModalContainer: React.FunctionComponent = () => {
  // Services
  const { error } = useContext(QueriesService);
  const {
    createAddonsConfiguration: [createAddonsConfiguration],
  } = useContext(MutationsService);
  const { validateName, configNameGenerator } = useContext(
    ConfigurationsService,
  );
  const { validateLabel } = useContext(LabelsService);
  const { validateUrl } = useContext(UrlsService);

  // Name
  const validateNameField = (name: string): string => validateName(name);
  const nameField = useInput('', validateNameField);

  // Urls
  const [urls, setUrls] = useState<string[]>([]);
  const addUrl = () => {
    if (urlField.value) {
      setUrls(oldUrls => [...oldUrls, urlField.value]);
      urlField.cleanUpField();
    }
  };
  const removeUrl = (url: string) => {
    setUrls(oldUrls => oldUrls.filter(u => u !== url));
  };
  const setEmptyUrls = () => {
    setUrls([]);
  };
  const validateUrlField = (url: string): string => {
    if (urls.length && !url) {
      urlField.cleanUpField();
      return '';
    }

    const existingUrls = [...urls];
    return validateUrl(url, existingUrls);
  };
  const handleEnterDownOnUrlField = (event: any) => {
    if (event.key === 'Enter' && !urlField.error) {
      addUrl();
    }
  };
  const urlField = useInput('', validateUrlField);

  // Labels
  const [labels, setLabel] = useState<string[]>([]);
  const addLabel = () => {
    if (labelsField.value) {
      setLabel(oldLabels => [...oldLabels, labelsField.value.trim()]);
      labelsField.cleanUpField();
    }
  };
  const removeLabel = (label: string) => {
    setLabel(oldLabels => oldLabels.filter(l => l !== label));
  };
  const setEmptyLabels = () => {
    setLabel([]);
  };
  const validateLabelsField = (label: string): string => {
    if (!label) {
      labelsField.cleanUpField();
      return '';
    }

    removeWhiteSpacesFromLabelsField();
    return validateLabel(label, labels);
  };
  const removeWhiteSpacesFromLabelsField = () => {
    if (/\s/.test(labelsField.value)) {
      labelsField.setValue(labelsField.value.trim());
    }
  };
  const handleEnterDownOnLabelsField = (event: any) => {
    if (event.key === 'Enter' && !labelsField.error) {
      addLabel();
    }
  };
  const extractLabels = (): ConfigurationLabels => {
    const extractedLabels: ConfigurationLabels = {};
    if (!labels.length) {
      return extractedLabels;
    }

    labels.forEach(label => {
      const splitedLabel = label.split('=');
      extractedLabels[splitedLabel[0]] = splitedLabel[1];
    });
    return extractedLabels;
  };
  const labelsField = useInput('', validateLabelsField);

  // Form
  const onSubmit = () => {
    let urlsToCreated: string[] = [...urls];
    if (urlField.value && urlField.valid) {
      urlsToCreated = [urlField.value, ...urlsToCreated];
    }
    const extractedLabels = extractLabels();

    createAddonsConfiguration({
      variables: {
        name: nameField.value,
        urls: urlsToCreated,
        labels: extractedLabels,
      },
    });
  };

  const resetFields = (): void => {
    nameField.cleanUpField();

    labelsField.cleanUpField();
    setEmptyLabels();

    urlField.cleanUpField();
    setEmptyUrls();
  };

  const onShowModal = () => {
    resetFields();
    nameField.setValue(configNameGenerator());
  };

  return (
    <Component
      nameField={nameField}
      labelsField={labelsField}
      urlField={urlField}
      onSubmit={onSubmit}
      labels={labels}
      urls={urls}
      addUrl={addUrl}
      removeUrl={removeUrl}
      addLabel={addLabel}
      removeLabel={removeLabel}
      handleEnterDownOnLabelsField={handleEnterDownOnLabelsField}
      handleEnterDownOnUrlField={handleEnterDownOnUrlField}
      onShowModal={onShowModal}
      error={Boolean(error)}
    />
  );
};

export default AddNewConfigurationModalContainer;
