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
  const editorContainer = useRef();
  const monacoEditorInstance = useRef();

  const observer = new IntersectionObserver(
    _ => {
      if (monacoEditorInstance.current) monacoEditorInstance.current.layout(); // force Monaco redraw once an intersection occured
    },
    { root: document.documentElement },
  );

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

  useEffect(() => {
    observer.observe(editorContainer.current); // add intersection observer to both versions of the editor
  }, [showDiff]);

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
