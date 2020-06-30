import React from 'react';

import { SchemaProperties } from './SchemaProperties';
import { SchemaExample } from './SchemaExample';
import { Table } from './Table';

import { bemClasses, searchForObject } from '../../../helpers';
import { TRIGGER_SCHEMA } from '../../../constants';

import './Schema.scss';

const classes = {
  schema: bemClasses.element(`schema`),
  schemaHeader: bemClasses.element(`schema-header`),
  schemaHeaderTitle: bemClasses.element(`schema-header-title`),
  schemaTable: bemClasses.element(`schema-table`),
};

const renderSchemaProps = (schemaName, schema) => {
  const properties = schema.properties;

  if (!properties) {
    return (
      <SchemaProperties name={schemaName} properties={schema} treeSpace={0} />
    );
  }

  return Object.entries(properties).map(([key, prop]) => (
    <SchemaProperties key={key} name={key} properties={prop} treeSpace={0} />
  ));
};

export const SchemaComponent = ({
  name = TRIGGER_SCHEMA.PAYLOAD_TEXT,
  schema,
}) => {
  if (!schema || schema.anyOf) {
    return null;
  }

  const hasNotField = searchForObject(schema, 'not');

  const header = (
    <header className={classes.schemaHeader}>
      <h3>
        <span className={classes.schemaHeaderTitle}>{name}</span>
      </h3>
    </header>
  );

  const content = (
    <>
      <div className={classes.schemaTable}>
        <Table
          header={{
            columns: TRIGGER_SCHEMA.COLUMN_NAMES,
          }}
        >
          {renderSchemaProps(name, schema)}
        </Table>
      </div>
      {/* we need to disable this component if schema has "not" field anywhere in it */}
      {hasNotField ? null : <SchemaExample schema={schema} />}
    </>
  );

  return (
    <section className={classes.schema}>
      {header}
      {content}
    </section>
  );
};
