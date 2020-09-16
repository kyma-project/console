import React, { useState } from 'react';

import { Button } from 'fundamental-react';

import {
  useCreateRepository,
  useUpdateRepository,
} from 'components/Lambdas/gql/hooks/mutations';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import RepositoryForm, { FORM_TYPE } from './RepositoryForm';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { REPOSITORIES_LIST } from 'components/Lambdas/constants';

export function CreateRepositoryModal({
  repositoryNames = [],
  serverDataError = false,
  serverDataLoading = false,
  onSuccessCallback,
}) {
  const createRepository = useCreateRepository({ onSuccessCallback });
  const [invalidModalPopupMessage, setInvalidModalPopupMessage] = useState('');

  const modalOpeningComponent = (
    <Button
      glyph="add"
      option="light"
      disabled={Boolean(serverDataError || serverDataLoading)}
    >
      {REPOSITORIES_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT}
    </Button>
  );

  return (
    <ModalWithForm
      title={REPOSITORIES_LIST.CREATE_MODAL.TITLE}
      modalOpeningComponent={modalOpeningComponent}
      confirmText={REPOSITORIES_LIST.CREATE_MODAL.CONFIRM_BUTTON.TEXT}
      invalidPopupMessage={invalidModalPopupMessage}
      id="create-repository-modal"
      className="repositories-list__create-repository-modal"
      renderForm={props => (
        <RepositoryForm
          {...props}
          onSubmitAction={createRepository}
          repositoryNames={repositoryNames}
          onSuccessCallback={onSuccessCallback}
          setInvalidModalPopupMessage={setInvalidModalPopupMessage}
          formType={FORM_TYPE.CREATE}
        />
      )}
    />
  );
}

export function UpdateRepositoryModal({
  repository,
  repositoryNames = [],
  serverDataError = false,
  serverDataLoading = false,
  onSuccessCallback,
}) {
  const updateRepository = useUpdateRepository({
    repository,
    onSuccessCallback,
  });
  const [invalidModalPopupMessage, setInvalidModalPopupMessage] = useState('');

  const modalOpeningComponent = (
    <Button
      glyph="edit"
      option="light"
      compact={true}
      disabled={Boolean(serverDataError || serverDataLoading)}
    />
  );

  const title = formatMessage(REPOSITORIES_LIST.UPDATE_MODAL.TITLE, {
    repositoryName: repository.name,
  });

  return (
    <ModalWithForm
      title={title}
      modalOpeningComponent={modalOpeningComponent}
      confirmText={REPOSITORIES_LIST.UPDATE_MODAL.CONFIRM_BUTTON.TEXT}
      invalidPopupMessage={invalidModalPopupMessage}
      id="create-repository-modal"
      className="repositories-list__create-repository-modal"
      renderForm={props => (
        <RepositoryForm
          {...props}
          onSubmitAction={updateRepository}
          repository={repository}
          repositoryNames={repositoryNames}
          onSuccessCallback={onSuccessCallback}
          setInvalidModalPopupMessage={setInvalidModalPopupMessage}
          formType={FORM_TYPE.UPDATE}
        />
      )}
    />
  );
}
