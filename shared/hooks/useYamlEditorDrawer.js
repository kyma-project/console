import React, { useState, useEffect, useRef } from 'react';
import { SideDrawer } from '../components/SideDrawer/SideDrawer';
import { Button } from 'fundamental-react';
import jsyaml from 'js-yaml';
import { ControlledEditor } from '@monaco-editor/react';
import LuigiClient from '@luigi-project/client';

const YamlContent = ({ json, changedYamlRef }) => {
  const [val, setVal] = useState(jsyaml.safeDump(json));

  useEffect(() => {
    const converted = jsyaml.safeDump(json);
    changedYamlRef.current = converted;
    setVal(converted);
  }, [json]);

  return (
    <>
      <h1 className="fd-has-type-4">YAML</h1>
      <ControlledEditor
        height="90vh"
        width="50em"
        language={'yaml'}
        theme="vs-light"
        value={val}
        onChange={(_, text) => {
          changedYamlRef.current = text;
          LuigiClient.uxManager().setDirtyStatus(true);
        }}
      />
    </>
  );
};

export const useYamlEditorDrawer = onSave => {
  const [editedJson, setEditedJson] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const changedYaml = useRef(null);

  useEffect(() => {
    LuigiClient.uxManager().setDirtyStatus(false);
    editedJson && setOpen(true);
  }, [editedJson]);

  useEffect(() => {
    if (!isOpen) setEditedJson(null);
  }, [isOpen]);

  const bottomContent = (
    <Button
      className="fd-has-margin-right-small"
      glyph="accept"
      type="positive"
      option="emphasized"
      onClick={() => onSave(changedYaml.current)}
    >
      Save
    </Button>
  );

  const drawerComponent = (
    <SideDrawer
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={null}
      bottomContent={bottomContent}
      hideDefaultButton={true}
    >
      <YamlContent json={editedJson} changedYamlRef={changedYaml} />
    </SideDrawer>
  );

  return [drawerComponent, setEditedJson];
};
