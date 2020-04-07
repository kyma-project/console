import React from 'react';

import { bemClasses } from '../../../../../helpers/misc';

const classes = {
  code: bemClasses.element(`code`),
  codeHeader: bemClasses.element(`code-header`),
  codePre: bemClasses.element(`code-pre`),
  codeBody: bemClasses.element(`code-body`),
};

export const CodeComponent = ({ title, code = '' }) => (
  <div className={classes.code}>
    {title && (
      <header className={classes.codeHeader}>
        <h4>{title}</h4>
      </header>
    )}
    <pre className={classes.codePre}>
      <code className={classes.codeBody}>{code}</code>
    </pre>
  </div>
);
