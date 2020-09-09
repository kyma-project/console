import React, { useState, useEffect } from 'react';
import { Button, Panel } from 'fundamental-react';
import { useDebouncedCallback } from 'use-debounce';

import { ControlledEditor } from '@monaco-editor/react';

import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { UPDATE_SECRET } from 'gql/mutations';
import { GET_SECRET_DETAILS } from 'gql/queries';

import './SecretJson.scss';

export default function SecretJson({ secret }) {
  const notificationManager = useNotification();
  const [updateSecret] = useMutation(UPDATE_SECRET, {
    refetchQueries: () => [
      {
        query: GET_SECRET_DETAILS,
        variables: {
          namespace: secret.namespace,
          name: secret.name,
        },
      },
    ],
  });

  const [disabled, setDisabled] = useState(false);
  const [json, setJson] = useState(JSON.stringify(secret.json, null, 1));

  const [debouncedCallback] = useDebouncedCallback(() => {
    checkValidity();
  }, 150);

  useEffect(() => {
    checkValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setJson(JSON.stringify(secret.json, null, 1));
  }, [secret.json]);

  function checkValidity() {
    if (json === '' || '{}') {
      setDisabled(true);
    }

    const originalJson = JSON.stringify(secret.json, null, 1);
    const isDiff = originalJson !== json;

    if (!isDiff) {
      setDisabled(true);
      return;
    }

    setDisabled(false);
  }

  function handleChange(_, value) {
    setJson(value);
    debouncedCallback();
  }

  async function handleSave() {
    try {
      await updateSecret({
        variables: {
          name: secret.name,
          namespace: secret.namespace,
          secret: JSON.parse(json),
        },
      });
      notificationManager.notifySuccess({
        content: `Secret ${secret.name} updated`,
      });
      setDisabled(true);
    } catch (e) {
      console.error(e);
      notificationManager.notifyError({
        content: `An error occurred while updating Secret: ${e.message}`,
      });
    }
  }

  const button = (
    <Button
      glyph="save"
      option={disabled ? 'light' : 'emphasized'}
      typeAttr="button"
      disabled={disabled}
      onClick={handleSave}
    >
      Save
    </Button>
  );

  return (
    <Panel className="fd-has-margin-m ">
      <Panel.Header>
        <Panel.Head title={'Source'} />
        <Panel.Actions>{button}</Panel.Actions>
      </Panel.Header>
      <div className="controlled-editor">
        <ControlledEditor
          id="secret-json"
          height="30em"
          language="json"
          theme="vs-light"
          value={json}
          onChange={handleChange}
        />
      </div>
    </Panel>
  );
}
