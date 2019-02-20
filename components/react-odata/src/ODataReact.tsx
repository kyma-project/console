import React from "react";
import { parse } from "./tools/Parser";
import { Child } from "./types";
import { mocks } from "./ODataFiles/index";

import TableContainer from "./components/Table/TableContainer";
import { ErrorComponent } from "./components/ErrorComponent/ErrorComponent";

const ODataReact = () => {
  const data = parse.ParseFromString(mocks.ODataFav11);
  const schema = data.getElementsByTagName("Schema");

  if (schema.length < 1) {
    return <ErrorComponent />;
  }

  const errors: Child[] = [];
  const dataForComponent: Child[] = [];

  schema[0].children.forEach((elem: Child) => {
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
