import React from 'react';
import { parse } from './tools/Parser';
import { Node } from './types';

import TableContainer from './components/Table/TableContainer';
import { ErrorComponent } from './components/ErrorComponent/ErrorComponent';

interface Props {
  schema: string;
}

const ODataReact: React.FunctionComponent<Props> = ({ schema }) => {
  if (!schema) {
    return <ErrorComponent />;
  }
  const data = parse.parseFromString(schema);
  if (!data) {
    return <ErrorComponent />;
  }

  const dataSchema = data.getElementsByTagName('Schema');

  if (dataSchema.length < 1) {
    return <ErrorComponent />;
  }

  const errors: Node[] = [];
  const dataForComponent: Node[] = [];

  dataSchema[0].children.forEach((elem: Node) => {
    if (elem.name === 'parsererror') {
      errors.push(elem);
    } else {
      dataForComponent.push(elem);
    }
  });

  return (
    <>
      {errors[0] && <ErrorComponent error={errors[0]} />}
      <TableContainer arg={dataForComponent} />
    </>
  );
};

export default ODataReact;
