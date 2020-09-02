import React, { useState, useEffect, useRef } from 'react';

import { Panel, Button, LayoutGrid } from 'fundamental-react';
import { Tooltip } from 'react-shared';
import { FormInput } from 'components/Lambdas/components';

import {
  useUpdateLambda,
  UPDATE_TYPE,
} from 'components/Lambdas/gql/hooks/mutations/useUpdateLambda';
import { BUTTONS, REPOSITORY_CONFIG_PANEL } from 'components/Lambdas/constants';

import './RepositoryConfig.scss';

const ERRORS = {
  REFERENCE: 'reference',
  BASE_DIR: 'baseDir',
};

const saveText = REPOSITORY_CONFIG_PANEL.SAVE_BUTTON.TEXT;
const editText = REPOSITORY_CONFIG_PANEL.EDIT_BUTTON.TEXT;

export default function RepositoryConfig({ lambda }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState([]);
  const [editStatus, setEditStatus] = useState('');
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.REPOSITORY_CONFIG,
  });

  const referenceCompRef = useRef(null);
  const referenceRef = useRef('');

  const baseDirCompRef = useRef(null);
  const baseDirRef = useRef('');

  function clearValues() {
    referenceCompRef.current &&
      typeof referenceCompRef.current.setFirstValue === 'function' &&
      referenceCompRef.current.setFirstValue();
    baseDirCompRef.current &&
      typeof baseDirCompRef.current.setFirstValue === 'function' &&
      baseDirCompRef.current.setFirstValue();
  }

  function addError(error) {
    setErrors([...errors, error]);
  }

  function removeError(error) {
    setErrors(errors.filter(err => err !== error));
  }

  useEffect(() => {
    if (errors.length) {
      setEditStatus(REPOSITORY_CONFIG_PANEL.ERRORS.INVALID);
      setIsValid(false);
    } else {
      if (
        referenceRef?.current?.value === lambda.reference &&
        baseDirRef?.current?.value === lambda.baseDir
      ) {
        setEditStatus(REPOSITORY_CONFIG_PANEL.ERRORS.NO_CHANGES);
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  }, [errors, setIsValid, setEditStatus, baseDirRef, referenceRef, lambda]);

  function validateReference(reference, setStatus) {
    if (!reference) {
      setStatus(REPOSITORY_CONFIG_PANEL.INPUTS.REFERENCE.ERRORS.EMPTY);
      addError(ERRORS.REFERENCE);
      return;
    }
    setStatus('');
    removeError(ERRORS.REFERENCE);
  }

  function validateBaseDir(baseDir, setStatus) {
    if (!baseDir) {
      setStatus(REPOSITORY_CONFIG_PANEL.INPUTS.BASE_DIR.ERRORS.EMPTY);
      addError(ERRORS.BASE_DIR);
      return;
    }
    setStatus('');
    removeError(ERRORS.BASE_DIR);
  }

  function handleSave() {
    updateLambda({
      reference: referenceRef.current.value,
      baseDir: baseDirRef.current.value,
    });
    setEditStatus(REPOSITORY_CONFIG_PANEL.ERRORS.NO_CHANGES);
  }

  function renderCancelButton() {
    if (!isEditMode) {
      return null;
    }

    return (
      <Button
        glyph="sys-cancel"
        type="negative"
        onClick={async () => {
          setIsEditMode(false);
          setIsValid(true);
          clearValues();
        }}
      >
        {BUTTONS.CANCEL}
      </Button>
    );
  }

  function renderConfirmButton() {
    const button = (
      <Button
        glyph={isEditMode ? 'save' : 'edit'}
        option={isEditMode ? 'emphasized' : 'light'}
        typeAttr="submit"
        onClick={() => {
          if (isEditMode) {
            handleSave();
          }
          setIsEditMode(prev => !prev);
        }}
        disabled={isEditMode && !isValid}
      >
        {isEditMode ? saveText : editText}
      </Button>
    );

    if (isEditMode && !isValid) {
      return (
        <Tooltip
          content={editStatus}
          position="top"
          trigger="mouseenter"
          tippyProps={{
            distance: 16,
          }}
        >
          {button}
        </Tooltip>
      );
    }
    return button;
  }

  return (
    <Panel className="fd-has-margin-m lambda-repository-config">
      <Panel.Header className="fd-has-padding-xs">
        <Panel.Head title={REPOSITORY_CONFIG_PANEL.TITLE} />
        <Panel.Actions>
          {renderCancelButton()}
          {renderConfirmButton()}
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body className="fd-has-padding-xs">
        <LayoutGrid cols={2}>
          <Panel className="has-box-shadow-none">
            <Panel.Header className="has-padding-none has-none-border-bottom">
              <Panel.Head
                title={REPOSITORY_CONFIG_PANEL.INPUTS.REFERENCE.LABEL}
                description={
                  REPOSITORY_CONFIG_PANEL.INPUTS.REFERENCE.INLINE_HELP
                }
              />
            </Panel.Header>
            <Panel.Body className="has-padding-none">
              <FormInput
                ref={referenceCompRef}
                _ref={referenceRef}
                noLabel={true}
                disabled={!isEditMode}
                id="reference"
                placeholder={
                  REPOSITORY_CONFIG_PANEL.INPUTS.REFERENCE.PLACEHOLDER
                }
                validate={validateReference}
                firstValue={lambda.reference}
              />
            </Panel.Body>
          </Panel>

          <Panel className="has-box-shadow-none">
            <Panel.Header className="has-padding-none has-none-border-bottom">
              <Panel.Head
                title={REPOSITORY_CONFIG_PANEL.INPUTS.BASE_DIR.LABEL}
                description={
                  REPOSITORY_CONFIG_PANEL.INPUTS.BASE_DIR.INLINE_HELP
                }
              />
            </Panel.Header>
            <Panel.Body className="has-padding-none">
              <FormInput
                ref={baseDirCompRef}
                _ref={baseDirRef}
                noLabel={true}
                disabled={!isEditMode}
                id="baseDir"
                placeholder={
                  REPOSITORY_CONFIG_PANEL.INPUTS.BASE_DIR.PLACEHOLDER
                }
                validate={validateBaseDir}
                firstValue={lambda.baseDir}
              />
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </Panel.Body>
    </Panel>
  );
}
