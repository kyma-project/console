import React, { useRef, useEffect } from 'react';
import { ControlledEditor, DiffEditor } from '@monaco-editor/react';

export default function Editor({
  id,
  language = 'javascript',
  showDiff = false,
  originalValue = '',
  value = '',
  controlledValue = '',
  setControlledValue = '',
  setValue,
  debouncedCallback = () => void 0,
}) {
  const subscription = useRef();

  // unsubscribe
  useEffect(() => {
    return () => {
      if (
        subscription &&
        subscription.current &&
        typeof subscription.current.dispose === 'function'
      ) {
        subscription.current.dispose();
      }
    };
  }, []);

  function handleDiffEditorDidMount(_, __, editor) {
    const { modified } = editor.getModel();

    subscription.current = modified.onDidChangeContent(_ => {
      setValue(modified.getValue());
      debouncedCallback();
    });
  }

  function handleControlledChange(_, value) {
    setValue(value);
    setControlledValue(value);
    debouncedCallback();
  }

  if (showDiff) {
    return (
      <DiffEditor
        id={id}
        height="30em"
        language={language}
        theme="vs-light"
        original={originalValue}
        modified={controlledValue}
        editorDidMount={handleDiffEditorDidMount}
      />
    );
  }

  return (
    <ControlledEditor
      id={id}
      height="30em"
      language={language}
      theme="vs-light"
      value={controlledValue}
      onChange={handleControlledChange}
    />
  );
}
