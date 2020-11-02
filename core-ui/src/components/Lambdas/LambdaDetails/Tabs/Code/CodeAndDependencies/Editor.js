import React, { useRef, useEffect, useState } from 'react';
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
  const editorContainer = useRef();
  const monacoEditorInstance = useRef();

  const observer = new IntersectionObserver(
    _ => {
      if (monacoEditorInstance.current) monacoEditorInstance.current.layout();
    },
    { root: document.documentElement },
  );

  // unsubscribe
  useEffect(() => {
    observer.observe(editorContainer.current);
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
    monacoEditorInstance.current = editor;
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
      <div className="diff-editor" ref={editorContainer}>
        <DiffEditor
          id={id}
          height="30em"
          language={language}
          theme="vs-light"
          original={originalValue}
          modified={controlledValue}
          editorDidMount={handleDiffEditorDidMount}
        />
      </div>
    );
  }

  return (
    <div className="controlled-editor" ref={editorContainer}>
      <ControlledEditor
        editorDidMount={(_, editor) => {
          monacoEditorInstance.current = editor;
        }}
        id={id}
        height="30em"
        language={language}
        theme="vs-light"
        value={controlledValue}
        onChange={handleControlledChange}
      />
    </div>
  );
}
