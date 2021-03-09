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
import {
  functionAvailableLanguages,
  nodejs12,
} from 'components/Lambdas/helpers/runtime';

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

  const [labels, setLabels] = useState({});

  const [runtime, setRuntime] = React.useState(nodejs12);
  const [sourceType, setSourceType] = React.useState('');
  const [repositoryName, setRepositoryName] = React.useState(
    repositories.length ? repositories[0].metadata.name : '',
  );
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
    if (sourceType) {
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
    sourceType,
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

  async function handleSubmit() {
    let inputData = {
      labels,
      runtime,
    };
    if (sourceType) {
      let reference = referenceRef?.current?.value || null;
      if (typeof reference === 'string') {
        reference = reference.trim();
      }

      let baseDir = baseDirRef?.current?.value || null;
      if (typeof baseDir === 'string') {
        baseDir = baseDir.trim();
      }

      inputData = {
        ...inputData,
        type: sourceType,
        source: repositoryName,
        reference,
        baseDir,
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
    key: `${repository.metadata.name} (${repository.spec.url})`,
    value: repository.metadata.name,
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
        onChange={e => setName(e.target.value)}
        nameStatus={nameStatus}
      />

      <LabelsInput
        labels={labels}
        onChange={newLabels => setLabels(newLabels)}
      />

      <DropdownInput
        label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.RUNTIME.LABEL}
        inlineHelp={LAMBDAS_LIST.CREATE_MODAL.INPUTS.RUNTIME.INLINE_HELP}
        options={runtimeOptions}
        id="runtime"
        defaultValue={runtime}
        onChange={e => setRuntime(e.target.value)}
      />

      <DropdownInput
        label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.SOURCE_TYPE.LABEL}
        inlineHelp={LAMBDAS_LIST.CREATE_MODAL.INPUTS.SOURCE_TYPE.INLINE_HELP}
        options={sourceTypeOptions}
        defaultValue={sourceType}
        id="sourceType"
        onChange={e => setSourceType(e.target.value)}
      />

      {sourceType &&
        (!repositories.length ? (
          <Alert dismissible={false} type="information">
            {LAMBDAS_LIST.CREATE_MODAL.ERRORS.NO_REPOSITORY_FOUND}
          </Alert>
        ) : (
          <>
            <DropdownInput
              label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.REPOSITORY.LABEL}
              inlineHelp={
                LAMBDAS_LIST.CREATE_MODAL.INPUTS.REPOSITORY.INLINE_HELP
              }
              options={repositoryOptions}
              id="repositoryName"
              defaultValue={repositoryName}
              onChange={e => setRepositoryName(e.target.value)}
            />

            <FormInput
              _ref={referenceRef}
              required={true}
              label={LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.LABEL}
              inlineHelp={
                LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.INLINE_HELP
              }
              id="reference"
              firstValue={'master'}
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
              firstValue={'/'}
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
