import React from "react";
import { parse } from "./tools/Parser";
import { Node } from "./types";
import { mocks } from "./ODataFiles/index";

import TableContainer from "./components/Table/TableContainer";
import { ErrorComponent } from "./components/ErrorComponent/ErrorComponent";

const ODataReact: React.FunctionComponent = () => {
  const data = parse.parseFromString(mocks.ODataFav21);
  const schema = data.getElementsByTagName("Schema");

  if (schema.length < 1) {
    return <ErrorComponent />;
  }

  const errors: Node[] = [];
  const dataForComponent: Node[] = [];

  schema[0].children.forEach((elem: Node) => {
    if (elem.name === "parsererror") {
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
