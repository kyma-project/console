import React, { useState, useEffect } from 'react';
import { Button, Toggle } from 'fundamental-react';
import { useDebouncedCallback } from 'use-debounce';

import { Tooltip } from 'react-shared';
import { TabsWithActions } from 'components/Lambdas/components';

import Editor from './Editor';

import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import {
  CODE_AND_DEPENDENCIES_PANEL,
  DEFAULT_LAMBDA_CODE,
  DEFAULT_LAMBDA_DEPS,
} from 'components/Lambdas/constants';

import './CodeAndDependencies.scss';

function formatDefaultDependencies(lambdaName) {
  return formatMessage(DEFAULT_LAMBDA_DEPS, { lambdaName });
}

export default function CodeAndDependencies({ lambda }) {
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.CODE_AND_DEPENDENCIES,
  });
  const [showDiff, setShowDiff] = useState(false);
  const [code, setCode] = useState(lambda.source || DEFAULT_LAMBDA_CODE);
  const [dependencies, setDependencies] = useState(
    lambda.dependencies || formatDefaultDependencies(lambda.name),
  );
  const [disableButton, setDisableButton] = useState(true);

  // TODO: Fix saving changes in diff mode - it doesn't work
  const [debouncedCallback] = useDebouncedCallback(() => {
    checkDifference();
  }, 150);

  useEffect(() => {
    setCode(lambda.source);
    setDependencies(lambda.dependencies);
    setDisableButton(true);
  }, [lambda]);

  function checkDifference() {
    const isDiff =
      lambda.source !== code || lambda.dependencies !== dependencies;
    setDisableButton(!isDiff);
  }

  function handleSave() {
    updateLambda({
      source: code,
      dependencies,
    });
  }

  const button = (
    <Button
      glyph="save"
      option="light"
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
      title={CODE_AND_DEPENDENCIES_PANEL.SAVE_BUTTON.POPUP_MESSAGE}
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
    <Toggle size="s" onChange={() => setShowDiff(prev => !prev)}>
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
          setValue={setCode}
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
          setValue={setDependencies}
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
