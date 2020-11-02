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
  const editorRef = useRef();
  const editorInstance = useRef();

  var observer = new IntersectionObserver(
    _ => {
      if (editorInstance.current) editorInstance.current.layout();
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
    observer.observe(editorRef.current);
    // console.log(editorRef.current);
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
      <div className="diff-editor">
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
  function handleMount(_, editor) {
    editorInstance.current = editor;
  }

  return (
    <div id="a">
      {/* {isV ? ( */}
      <div className="controlled-editor" ref={editorRef}>
        {/* <button onClick={_ => setV(!isV)}>reload</button> */}

        <ControlledEditor
          editorDidMount={handleMount}
          id={id}
          height="30em"
          language={language}
          theme="vs-light"
          value={controlledValue}
          onChange={handleControlledChange}
        />
      </div>

      {/* ) : null} */}
    </div>
  );
}
