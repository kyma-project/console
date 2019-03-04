import React from "react";
import { Node } from "../../types";
import { StyledCode, PageWrapper } from "../styled/styled";
import { Alert } from "fundamental-react";

interface Props {
  error?: Node;
}

const ErrorComponent: React.FunctionComponent<Props> = ({ error }) => {
  if (!error) {
    return (
      <PageWrapper>
        <Alert dismissible={true} type="error">
          {"No schema in data / format of the data is wrong"}
        </Alert>
      </PageWrapper>
    );
  }

  const data = error.children.map((elem: Node) => elem.value);
  const [header, code, p] = data;
  return (
    <PageWrapper>
      <Alert dismissible={true} type="error">
        <h3>{header}</h3>
        <StyledCode>{code}</StyledCode>
        <p>{p}</p>
      </Alert>
    </PageWrapper>
  );
};

export { ErrorComponent };
