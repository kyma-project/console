import React from 'react';

import { CodeComponent } from './CodeComponent';

import { bemClasses } from '../../../helpers';
import { TRIGGER_SCHEMA } from '../../../constants';

const classes = {
  schemaExample: bemClasses.element(`schema-example`),
  schemaHeader: bemClasses.element(`schema-example-header`),
  schemaHeaderTitle: bemClasses.element(`schema-example-header-title`),
};

export const SchemaExample = ({ schema = {} }) => {
  const example = JSON.stringify(schema.example || {}, null, 2);

  if (!example || !Object.keys(example).length) {
    return null;
  }

  const renderedTitle = (
    <header className={classes.schemaHeader}>
      <span className={classes.schemaHeaderTitle}>
        {TRIGGER_SCHEMA.EXAMPLE_TEXT}
      </span>
    </header>
  );

  return (
    <div className={classes.schemaExample}>
      <CodeComponent code={example} title={renderedTitle} />
    </div>
  );
};
