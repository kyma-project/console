import React, { useState, useEffect, useRef, useCallback } from 'react';
import LuigiClient from '@luigi-project/client';

import {
  ResourceNameInput,
  DropdownInput,
  FormInput,
} from 'components/Lambdas/components';

import {
  randomNameGenerator,
  validateResourceName,
} from 'components/Lambdas/helpers/misc';
import { isGitUrl } from 'components/Lambdas/helpers/repositories';

import { REPOSITORIES_LIST } from 'components/Lambdas/constants';

export const FORM_TYPE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
};

const ERRORS = {
  NAME: 'name',
  REPOSITORY_URL: 'repositoryUrl',
  SECRET_NAME: 'secretName',
};

export default function RepositoryForm({
  onChange,
  formElementRef,
  isValid = false,
  setValidity = () => void 0,
  setInvalidModalPopupMessage = () => void 0,
  repository = void 0,
  repositoryNames = [],
  onSubmitAction,
  formType = FORM_TYPE.CREATE,
}) {
  const [errors, setErrors] = useState(
    repository ? [] : [ERRORS.REPOSITORY_URL],
  );

  const [name, setName] = useState(randomNameGenerator());
  const [nameStatus, setNameStatus] = useState('');

  const [showSecretName, setShowSecretName] = useState(!!repository?.spec.auth);

  const urlRef = useRef('');
  const authTypeRef = useRef('');
  const secretNameRef = useRef('');

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
      setInvalidModalPopupMessage(REPOSITORIES_LIST.MODAL_ERROR);
      setValidity(false);
    }
  }, [isValid, errors, setValidity, setInvalidModalPopupMessage]);

  useEffect(() => {
    if (showSecretName) {
      if (!(secretNameRef.current && secretNameRef.current.value)) {
        addError(ERRORS.SECRET_NAME);
      }
    } else {
      removeError(ERRORS.SECRET_NAME);
    }
  }, [showSecretName, addError, removeError]);

  useEffect(() => {
    const validationMessage = validateResourceName(
      name,
      repositoryNames,
      REPOSITORIES_LIST.MODAL_INPUTS.NAME.ERRORS,
    );
    if (validationMessage) {
      setNameStatus(validationMessage);
      addError(ERRORS.NAME);
      return;
    }
    setNameStatus('');
    removeError(ERRORS.NAME);
  }, [setNameStatus, repositoryNames, name, addError, removeError]);

  useEffect(() => {
    if (errors.length) {
      setInvalidModalPopupMessage(REPOSITORIES_LIST.MODAL_ERROR);
      setValidity(false);
    } else {
      setInvalidModalPopupMessage('');
      setValidity(true);
    }
  }, [errors, setValidity, setInvalidModalPopupMessage]);

  function validateRepositoryUrl(url, setStatus) {
    if (!url) {
      setStatus(REPOSITORIES_LIST.MODAL_INPUTS.URL.ERRORS.EMPTY);
      addError(ERRORS.REPOSITORY_URL);
      return;
    }

    const isCorrectUrl = isGitUrl(url);
    if (!isCorrectUrl) {
      setStatus(REPOSITORIES_LIST.MODAL_INPUTS.URL.ERRORS.INVALID);
      addError(ERRORS.REPOSITORY_URL);
      return;
    }

    setStatus('');
    removeError(ERRORS.REPOSITORY_URL);
  }

  function validateSecretName(secretName, setStatus) {
    const validationMessage = validateResourceName(
      secretName,
      [],
      REPOSITORIES_LIST.MODAL_INPUTS.SECRET_NAME.ERRORS,
    );
    if (validationMessage) {
      setStatus(validationMessage);
      addError(ERRORS.SECRET_NAME);
      return;
    }

    setStatus('');
    removeError(ERRORS.SECRET_NAME);
  }

  function updateName(event) {
    setName(event.target.value);
  }

  function updateAuthType(event) {
    setShowSecretName(event.target.value !== '');
  }

  async function handleSubmit() {
    const spec = {
      url: urlRef.current.value,
      auth: null,
    };

    if (authTypeRef.current.value) {
      spec.auth = {
        type: authTypeRef.current.value,
        secretName: secretNameRef.current.value,
      };
    }

    if (formType === FORM_TYPE.CREATE) {
      await onSubmitAction({
        name: name,
        namespace: LuigiClient.getEventData().environmentId,
        spec,
      });
    } else {
      await onSubmitAction(spec);
    }
  }

  const authTypeOptions = REPOSITORIES_LIST.MODAL_INPUTS.AUTH_TYPE.OPTIONS.map(
    option => ({
      key: option.KEY,
      value: option.VALUE,
    }),
  );

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleSubmit}
    >
      {!repository && (
        <ResourceNameInput
          id="repositoryName"
          kind="Repository"
          value={name}
          onChange={updateName}
          nameStatus={nameStatus}
        />
      )}

      <FormInput
        _ref={urlRef}
        required={true}
        label={REPOSITORIES_LIST.MODAL_INPUTS.URL.LABEL}
        inlineHelp={REPOSITORIES_LIST.MODAL_INPUTS.URL.INLINE_HELP}
        id="repositoryUrl"
        placeholder={REPOSITORIES_LIST.MODAL_INPUTS.URL.PLACEHOLDER}
        validate={validateRepositoryUrl}
        firstValue={repository?.spec.url}
      />

      <DropdownInput
        _ref={authTypeRef}
        label={REPOSITORIES_LIST.MODAL_INPUTS.AUTH_TYPE.LABEL}
        inlineHelp={REPOSITORIES_LIST.MODAL_INPUTS.AUTH_TYPE.INLINE_HELP}
        options={authTypeOptions}
        id="authType"
        onChange={updateAuthType}
        defaultValue={repository?.spec.auth?.type}
      />

      {showSecretName && (
        <FormInput
          _ref={secretNameRef}
          required={true}
          label={REPOSITORIES_LIST.MODAL_INPUTS.SECRET_NAME.LABEL}
          inlineHelp={REPOSITORIES_LIST.MODAL_INPUTS.SECRET_NAME.INLINE_HELP}
          id="secretName"
          placeholder={REPOSITORIES_LIST.MODAL_INPUTS.SECRET_NAME.PLACEHOLDER}
          validate={validateSecretName}
          firstValue={repository?.spec.auth?.secretName}
        />
      )}
    </form>
  );
}
