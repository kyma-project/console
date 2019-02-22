import styled from "styled-components";

export const StyledTable = styled.table`
  ${(props) => props.theme.table}
`;

export const LeftAlignedHeader = styled.th`
  text-align: left;
`;

export const StyledCode = styled.code`
  ${(props) => props.theme.code};
`;
