import React from 'react';
import merge from 'merge';

import { TableRow } from './Table';
import { TreeLeaf, TreeSpace, Markdown } from './Atomics';

const schemaPropertiesAccessors = [
  el => (
    <>
      {(() => {
        const treeSpaces = [];
        if (el.treeSpace) {
          for (let i = 0; i < el.treeSpace; i++) {
            treeSpaces.push(<TreeSpace key={i} />);
          }
          treeSpaces.push(<TreeLeaf key={el.treeSpace} />);
        }
        return treeSpaces;
      })()}
      {el.schema.key}
    </>
  ),
  el => <span>{el.schema.content.title}</span>,
  el => (
    <span>
      {el.schema.content.type}
      {el.schema.content.anyOf ? ` ${el.schema.content.anyOf}` : ''}
      {el.schema.content.oneOf ? ` ${el.schema.content.oneOf}` : ''}
      {el.schema.content.items && el.schema.content.items.type
        ? ` (${el.schema.content.items.type})`
        : ''}
    </span>
  ),
  el => <span>{el.schema.content.format}</span>,
  el => <span>{el.schema.content.default}</span>,
  el =>
    el.schema.content.description && (
      <Markdown>{el.schema.content.description}</Markdown>
    ),
];

const handleNotProperty = prop => {
  if (prop.not) {
    const arrayOfChangedObjects = Object.entries(prop).map(([key, val]) => {
      if (key === 'not') {
        return { properties: { [key]: val } };
      }
      return prop[key];
    });

    return merge.recursive(...arrayOfChangedObjects);
  }
  return prop;
};

const renderItems = (schema, treeSpace) => {
  const properties = schema.items && schema.items.properties;

  if (!properties) {
    return null;
  }

  return renderProperties(schema.items, treeSpace);
};

const renderOf = (schemas, treeSpace) => {
  if (!schemas || !schemas.length) {
    return null;
  }

  return schemas.map((schema, index) => {
    const id = index.toString();

    return (
      <SchemaProperties
        key={index}
        name={id}
        properties={schema}
        treeSpace={treeSpace}
      />
    );
  });
};

const renderProperties = (schema, treeSpace) => {
  const properties = schema.properties;

  if (!properties) {
    return null;
  }

  return Object.entries(properties).map(([key, prop]) => (
    <SchemaProperties
      key={key}
      name={key}
      properties={prop}
      treeSpace={treeSpace}
    />
  ));
};

export const SchemaProperties = ({ name, properties, treeSpace }) => {
  const alteredProperties = handleNotProperty(properties);
  const space = treeSpace + 1;
  const element = {
    schema: {
      key: name,
      content: alteredProperties,
    },
    treeSpace,
  };

  return (
    <>
      <TableRow accessors={schemaPropertiesAccessors} element={element} />
      {renderOf(alteredProperties.anyOf, space)}
      {renderOf(alteredProperties.oneOf, space)}
      {renderProperties(alteredProperties, space)}
      {renderItems(alteredProperties, space)}
    </>
  );
};
