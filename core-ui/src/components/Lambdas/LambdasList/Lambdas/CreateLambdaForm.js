import React, { useState, useEffect, useRef, useCallback } from 'react';
import LuigiClient from '@luigi-project/client';

import { Alert } from 'fundamental-react';

import {
  ResourceNameInput,
  LabelsInput,
  DropdownInput,
  FormInput,
} from 'components/Lambdas/components';

import { useCreateLambda } from 'components/Lambdas/gql/hooks/mutations';

import {
  randomNameGenerator,
  validateResourceName,
} from 'components/Lambdas/helpers/misc';
import { functionAvailableLanguages } from 'components/Lambdas/helpers/runtime';

import { LAMBDAS_LIST } from 'components/Lambdas/constants';

const ERRORS = {
  NAME: 'name',
  REPOSITORY_URL: 'repositoryUrl',
  REFERENCE: 'reference',
  BASE_DIR: 'baseDir',
};

export default function CreateLambdaForm({
  onChange,
  formElementRef,
  isValid = false,
  setValidity = () => void 0,
  setInvalidModalPopupMessage = () => void 0,
  functionNames = [],
  repositories = [],
}) {
  const createLambda = useCreateLambda({ redirect: true });
  const [errors, setErrors] = useState([]);

  const [nameStatus, setNameStatus] = useState('');
  const [name, setName] = useState(randomNameGenerator());
  const [showRepositoryConfig, setShowRepositoryConfig] = useState(false);

  const [labels, setLabels] = useState({});

  const runtimeRef = useRef('');
  const sourceTypeRef = useRef('');
  const repositoryRef = useRef('');
  const referenceRef = useRef('');
  const baseDirRef = useRef('');

  const addError = useCallback(
    (...newErrors) => setErrors(oldErrors => [...oldErrors, ...newErrors]),
    [setErrors],
  );
  const removeError = useCallback(
    (...newErrors) =>
      setErrors(oldErrors => oldErrors.filter(err => !newErrors.includes(err))),
    [setErrors],
  );

  useEffect(() => {
    if (isValid && errors.length) {
      setInvalidModalPopupMessage(LAMBDAS_LIST.CREATE_MODAL.ERRORS.INVALID);
      setValidity(false);
    }
  }, [isValid, errors, setValidity, setInvalidModalPopupMessage]);

  useEffect(() => {
    if (errors.length) {
      setInvalidModalPopupMessage(LAMBDAS_LIST.CREATE_MODAL.ERRORS.INVALID);
      setValidity(false);
    } else {
      setInvalidModalPopupMessage('');
      setValidity(true);
    }
  }, [errors, setValidity, setInvalidModalPopupMessage]);

  useEffect(() => {
    if (showRepositoryConfig) {
      if (!repositories.length) {
        addError(ERRORS.REPOSITORY_URL);
        setValidity(false);
        setInvalidModalPopupMessage(
          LAMBDAS_LIST.CREATE_MODAL.ERRORS.NO_REPOSITORY_FOUND,
        );
      } else {
        addError(ERRORS.REFERENCE, ERRORS.BASE_DIR);
      }
    } else {
      removeError(ERRORS.REPOSITORY_URL, ERRORS.REFERENCE, ERRORS.BASE_DIR);
    }
  }, [
    showRepositoryConfig,
    setInvalidModalPopupMessage,
    repositories,
    setValidity,
    addError,
    removeError,
  ]);

  useEffect(() => {
    const validationMessage = validateResourceName(
      name,
      functionNames,
      LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS,
    );
    if (validationMessage) {
      setNameStatus(validationMessage);
      addError(ERRORS.NAME);
      return;
    }
    setNameStatus('');
    removeError(ERRORS.NAME);
  }, [setNameStatus, functionNames, name, addError, removeError]);

  function validateReference(reference, setStatus) {
    if (!reference) {
      setStatus(LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.ERRORS.EMPTY);
      addError(ERRORS.REFERENCE);
      return;
    }
    setStatus('');
    removeError(ERRORS.REFERENCE);
  }

  function validateBaseDir(baseDir, setStatus) {
    if (!baseDir) {
      setStatus(LAMBDAS_LIST.CREATE_MODAL.INPUTS.BASE_DIR.ERRORS.EMPTY);
      addError(ERRORS.BASE_DIR);
      return;
    }
    setStatus('');
    removeError(ERRORS.BASE_DIR);
  }

  function updateName(event) {
    setName(event.target.value);
  }

  function updateSourceType(event) {
    setShowRepositoryConfig(event.target.value !== '');
  }

  async function handleSubmit() {
    let inputData = {
      labels,
      runtime:
        runtimeRef?.current?.value || functionAvailableLanguages.nodejs12,
    };

    if (sourceTypeRef?.current?.value) {
      inputData = {
        ...inputData,
        sourceType: sourceTypeRef?.current?.value || null,
        source: repositoryRef?.current?.value || null,
        reference: referenceRef?.current?.value || null,
        baseDir: baseDirRef?.current?.value || null,
        dependencies: '',
      };
    }

    await createLambda({
      name: name,
      namespace: LuigiClient.getEventData().environmentId,
      inputData,
    });
  }

  const runtimeOptions = Object.entries(functionAvailableLanguages).map(
    ([runtime, lang]) => ({
      key: lang,
      value: runtime,
    }),
  );
  const sourceTypeOptions = LAMBDAS_LIST.CREATE_MODAL.INPUTS.SOURCE_TYPE.OPTIONS.map(
    sourceType => ({
      key: sourceType.KEY,
      value: sourceType.VALUE,
    }),
  );
  const repositoryOptions = repositories.map(repository => ({
    key: `${repository.name} (${repository.spec.url})`,
    value: repository.name,
  }));

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleSubmit}
    >
      <ResourceNameInput
        id="lambdaName"
        kind="Function"
        value={name}
        onChange={updateName}
        nameStatus={nameStatus}
      />

      <LabelsInput
        labels={labels}
        onChange={newLabels => setLabels(newLabels)}
      />

      <DropdownInput
        _ref={runtimeRef}
        label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.RUNTIME.LABEL}
        inlineHelp={LAMBDAS_LIST.CREATE_MODAL.INPUTS.RUNTIME.INLINE_HELP}
        options={runtimeOptions}
        id="runtime"
        defaultValue={functionAvailableLanguages.nodejs12}
      />

      <DropdownInput
        _ref={sourceTypeRef}
        label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.SOURCE_TYPE.LABEL}
        inlineHelp={LAMBDAS_LIST.CREATE_MODAL.INPUTS.SOURCE_TYPE.INLINE_HELP}
        options={sourceTypeOptions}
        defaultValue={undefined}
        id="sourceType"
        onChange={updateSourceType}
      />

      {showRepositoryConfig &&
        (!repositories.length ? (
          <Alert dismissible={false} type="information">
            {LAMBDAS_LIST.CREATE_MODAL.ERRORS.NO_REPOSITORY_FOUND}
          </Alert>
        ) : (
          <>
            <DropdownInput
              _ref={repositoryRef}
              label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.REPOSITORY.LABEL}
              inlineHelp={
                LAMBDAS_LIST.CREATE_MODAL.INPUTS.REPOSITORY.INLINE_HELP
              }
              options={repositoryOptions}
              id="repository"
              defaultValue={undefined}
            />

            <FormInput
              _ref={referenceRef}
              required={true}
              label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.LABEL}
              inlineHelp={
                LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.INLINE_HELP
              }
              id="reference"
              placeholder={
                LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.PLACEHOLDER
              }
              validate={validateReference}
            />

            <FormInput
              _ref={baseDirRef}
              required={true}
              label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.BASE_DIR.LABEL}
              inlineHelp={LAMBDAS_LIST.CREATE_MODAL.INPUTS.BASE_DIR.INLINE_HELP}
              id="baseDir"
              placeholder={
                LAMBDAS_LIST.CREATE_MODAL.INPUTS.BASE_DIR.PLACEHOLDER
              }
              validate={validateBaseDir}
            />
          </>
        ))}
    </form>
  );
}
