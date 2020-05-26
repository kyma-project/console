import React, { useState } from 'react';
import { Button, Toggle } from 'fundamental-react';
import { useDebouncedCallback } from 'use-debounce';

import { Tooltip } from 'react-shared';
import { TabsWithActions } from 'components/Lambdas/components';

import Editor from './Editor';

import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import { CODE_AND_DEPENDENCIES_PANEL } from 'components/Lambdas/constants';

import './CodeAndDependencies.scss';

export default function CodeAndDependencies({ lambda }) {
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.CODE_AND_DEPENDENCIES,
  });

  const [showDiff, setShowDiff] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  const [code, setCode] = useState(lambda.source);
  const [controlledCode, setControlledCode] = useState(lambda.source);

  const [dependencies, setDependencies] = useState(lambda.dependencies);
  const [controllerDependencies, setControlledDependencies] = useState(
    lambda.dependencies,
  );

  const [debouncedCallback] = useDebouncedCallback(() => {
    checkDifference();
  }, 150);

  function checkDifference() {
    const isDiff =
      lambda.source !== code || lambda.dependencies !== dependencies;
    setDisableButton(!isDiff);
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
    setDisableButton(true);
  }

  const button = (
    <Button
      glyph="save"
      option={disableButton ? 'light' : 'default'}
      typeAttr="button"
      disabled={disableButton}
      onClick={handleSave}
    >
      {CODE_AND_DEPENDENCIES_PANEL.SAVE_BUTTON.TEXT}
    </Button>
  );
  const saveButton = !disableButton ? (
    button
  ) : (
    <Tooltip
      content={CODE_AND_DEPENDENCIES_PANEL.SAVE_BUTTON.POPUP_MESSAGE}
      position="top"
      trigger="mouseenter"
      tippyProps={{
        distance: 16,
      }}
    >
      {button}
    </Tooltip>
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

  const tabsData = [
    {
      id: 'function-code',
      title: CODE_AND_DEPENDENCIES_PANEL.TABS.CODE,
      body: (
        <Editor
          id="lambda-code"
          language="javascript"
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
          language="json"
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
