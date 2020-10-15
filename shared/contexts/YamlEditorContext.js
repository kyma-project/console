import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { SideDrawer } from '../components/SideDrawer/SideDrawer';
import { Button } from 'fundamental-react';
import jsyaml from 'js-yaml';
import { ControlledEditor } from '@monaco-editor/react';
import LuigiClient from '@luigi-project/client';

export const YamlEditorContext = createContext({
  setEditedJson: _ => {},
});

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

export const YamlEditorProvider = ({ children }) => {
  const [json, setJson] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const changedYaml = useRef(null);
  const onSave = useRef(_ => {});

  useEffect(() => {
    LuigiClient.uxManager().setDirtyStatus(false);
    json && setOpen(true);
  }, [json]);

  useEffect(() => {
    if (!isOpen) setJson(null);
  }, [isOpen]);

  function setEditedJson(newJson, onSaveHandler) {
    onSave.current = onSaveHandler;
    setJson(newJson);
  }

  const bottomContent = (
    <>
      <Button
        className="fd-has-margin-right-small"
        glyph="accept"
        type="positive"
        option="emphasized"
        onClick={() => onSave.current(changedYaml.current)}
      >
        Save
      </Button>
      <Button glyph="cancel" type="negative" onClick={() => setOpen(!isOpen)}>
        Cancel
      </Button>
    </>
  );

  const drawerComponent = (
    <SideDrawer
      isOpen={isOpen}
      setOpen={setOpen}
      buttonText={null}
      bottomContent={bottomContent}
      hideDefaultButton={true}
    >
      <YamlContent json={json} changedYamlRef={changedYaml} />
    </SideDrawer>
  );

  return (
    <YamlEditorContext.Provider value={setEditedJson}>
      {drawerComponent}
      {children}
    </YamlEditorContext.Provider>
  );
};

export function useYamlEditor() {
  return useContext(YamlEditorContext);
}
