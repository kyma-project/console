import React, { useState, useEffect } from 'react';
import { SideDrawer } from '../components/SideDrawer/SideDrawer';
import { Button } from 'fundamental-react';
import jsyaml from 'js-yaml';
import { ControlledEditor } from '@monaco-editor/react';
import LuigiClient from '@luigi-project/client';

const YamlContent = ({ json }) => {
  const [val, setVal] = useState(jsyaml.safeDump(json));
  useEffect(() => {
    setVal(jsyaml.safeDump(json));
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
        // onChange={(_, text) => {
        //   setUnsavedChanges(true);
        //   setVal(jsyaml.safeDump(json));
        //   changedYAML.current = text;
        // }}
      />
    </>
  );
};

export const useYamlEditorDrawer = ({ onSave }) => {
  const [editedJson, setEditedJson] = useState(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    editedJson && setOpen(true);
  }, [editedJson]);

  useEffect(() => {
    if (!isOpen) setEditedJson(null);
  }, [isOpen]);

  // useEffect(() => {
  //   LuigiClient.uxManager().setDirtyStatus(hasUnsavedChanges);
  // }, [hasUnsavedChanges]);

  // const [hasUnsavedChanges, setUnsavedChanges] = useState(false);

  // useEffect(() => {
  //   if (editedJson) setContent();
  //   else setContent(null);
  // }, [editedJson]);

  const bottomContent = (
    <Button
      className="fd-has-margin-right-small"
      glyph="accept"
      type="positive"
      option="emphasized"
      // onClick={() => handleSaveClick(changedYAML.current)}
      // disabled={!hasUnsavedChanges}
    >
      Save
    </Button>
  );

  // console.log(content, isOpen);
  const drawerComponent = (
    <SideDrawer
      //  onManualClose={_ => setEditedJson(null)}
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={null}
      bottomContent={bottomContent}
      hideDefaultButton={true}
    >
      <YamlContent json={editedJson} />
    </SideDrawer>
  );

  return [drawerComponent, setEditedJson];
};
