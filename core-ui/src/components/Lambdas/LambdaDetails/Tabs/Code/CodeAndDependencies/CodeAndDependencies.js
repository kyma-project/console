import React, { useState, useEffect } from 'react';
import { Button, Toggle } from 'fundamental-react';
import { useDebouncedCallback } from 'use-debounce';

import { Tooltip } from 'react-shared';
import { TabsWithActions } from 'components/Lambdas/components';

import Editor from './Editor';

import {
  useUpdateLambda,
  UPDATE_TYPE,
} from 'components/Lambdas/gql/hooks/mutations/useUpdateLambda';
import { CODE_AND_DEPENDENCIES_PANEL } from 'components/Lambdas/constants';

import './CodeAndDependencies.scss';
import {
  runtimeToMonacoEditorLang,
  checkDepsValidity,
} from 'components/Lambdas/helpers/runtime';

const DISABLED_CAUSES = {
  VALID: 'VALID',
  EMPTY_SOURCE: 'EMPTY_SOURCE',
  INVALID_DEPS: 'INVALID_DEPS',
  NO_CHANGES: 'NO_CHANGES',
};

export default function CodeAndDependencies({ lambda }) {
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.CODE_AND_DEPENDENCIES,
  });

  const [showDiff, setShowDiff] = useState(false);
  const [disabledCause, setDisabledCause] = useState(
    DISABLED_CAUSES.NO_CHANGES,
  );

  const [code, setCode] = useState(lambda.source);
  const [controlledCode, setControlledCode] = useState(lambda.source);

  const [dependencies, setDependencies] = useState(lambda.dependencies);
  const [controllerDependencies, setControlledDependencies] = useState(
    lambda.dependencies,
  );

  const [debouncedCallback] = useDebouncedCallback(() => {
    checkValidity();
  }, 150);

  useEffect(() => {
    checkValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkValidity() {
    const trimmedCode = (code || '').trim();
    if (!trimmedCode) {
      setDisabledCause(DISABLED_CAUSES.EMPTY_SOURCE);
      return;
    }

    const deps = (dependencies || '').trim();

    if (!checkDepsValidity(lambda.runtime, deps)) {
      setDisabledCause(DISABLED_CAUSES.INVALID_DEPS);
      return;
    }

    const isDiff =
      lambda.source !== code || lambda.dependencies !== dependencies;
    if (!isDiff) {
      setDisabledCause(DISABLED_CAUSES.NO_CHANGES);
      return;
    }

    setDisabledCause(DISABLED_CAUSES.VALID);
  }

  function onChangeToggle() {
    setControlledCode(code);
    setControlledDependencies(dependencies);
    setShowDiff(prev => !prev);
  }

  function handleSave() {
    updateLambda({
      source: code,
      dependencies,
    });
    setDisabledCause(DISABLED_CAUSES.NO_CHANGES);
  }

  function checkPopupMessage() {
    const messages = CODE_AND_DEPENDENCIES_PANEL.SAVE_BUTTON.POPUP_MESSAGE;
    let message = '';
    switch (disabledCause) {
      case DISABLED_CAUSES.EMPTY_SOURCE: {
        message = messages.EMPTY_SOURCE;
        break;
      }
      case DISABLED_CAUSES.INVALID_DEPS: {
        message = messages.INVALID_DEPS;
        break;
      }
      case DISABLED_CAUSES.NO_CHANGES: {
        message = messages.NO_CHANGES;
        break;
      }
      default:
        message = '';
    }
    return message;
  }

  const popupMessage = checkPopupMessage();
  const disabled = !!popupMessage;

  const button = (
    <Button
      glyph="save"
      option={disabled ? 'light' : 'emphasized'}
      typeAttr="button"
      disabled={disabled}
      onClick={handleSave}
    >
      {CODE_AND_DEPENDENCIES_PANEL.SAVE_BUTTON.TEXT}
    </Button>
  );

  const saveButton = disabled ? (
    <Tooltip
      content={popupMessage}
      position="top"
      trigger="mouseenter"
      tippyProps={{
        distance: 16,
      }}
    >
      {button}
    </Tooltip>
  ) : (
    button
  );

  const toggle = (
    <Toggle size="s" onChange={onChangeToggle}>
      {CODE_AND_DEPENDENCIES_PANEL.DIFF_TOGGLE}
    </Toggle>
  );
  const actions = (
    <>
      {toggle}
      {saveButton}
    </>
  );

  const {
    language: monacoEditorLang,
    dependencies: monacoEditorDeps,
  } = runtimeToMonacoEditorLang(lambda.runtime);

  const tabsData = [
    {
      id: 'function-code',
      title: CODE_AND_DEPENDENCIES_PANEL.TABS.CODE,
      body: (
        <Editor
          id="lambda-code"
          language={monacoEditorLang}
          showDiff={showDiff}
          originalValue={lambda.source}
          value={code}
          controlledValue={controlledCode}
          setValue={setCode}
          setControlledValue={setControlledCode}
          debouncedCallback={debouncedCallback}
        />
      ),
    },
    {
      id: 'function-dependencies',
      title: CODE_AND_DEPENDENCIES_PANEL.TABS.DEPENDENCIES,
      body: (
        <Editor
          id="lambda-dependencies"
          language={monacoEditorDeps}
          showDiff={showDiff}
          originalValue={lambda.dependencies}
          value={dependencies}
          controlledValue={controllerDependencies}
          setValue={setDependencies}
          setControlledValue={setControlledDependencies}
          debouncedCallback={debouncedCallback}
        />
      ),
    },
  ];

  return (
    <TabsWithActions
      className="fd-has-margin-medium lambda-code-and-deps"
      tabsData={tabsData}
      actions={actions}
    />
  );
}
