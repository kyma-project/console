import React from "react";
import { Child } from "../types";
interface Props {
  error?: Child;
}

const ErrorComponent: React.FunctionComponent<Props> = ({
  error,
}): JSX.Element => {
  if (!error) {
    return <p>{"No schema in data / format of the data is wrong"}</p>;
  }
  const data = error.children.map((elem: Child) => elem.value);
  return (
    <div>
      <h3>{data[0]}</h3>
      <code>{data[1]}</code>
      <p>{data[2]}</p>
    </div>
  );
};

export { ErrorComponent };
