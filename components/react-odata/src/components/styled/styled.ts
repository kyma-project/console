import { styled } from "../../theme/index";
import { Icon } from "fundamental-react/lib/Icon";
export const StyledTable = styled.table``;

export const LeftAlignedHeader = styled.th`
  text-align: left;
`;

export const StyledCode = styled.code``;

export const TableWrapper = styled.section`
  /* border: 1px solid red; */
  margin-bottom: 10px;
`;
export const TableHeader = styled.p`
  margin: 5px;
  font-size: 20px;
  font-weight: bold;
`;

export const CollapseArrow = styled(Icon)`
  margin-left: 5px;
  position: relative;
  display: inline-block;
  &:before {
    transition: 0.3s ease;
    ${(props: { open?: boolean }) => props.open && "transform: rotate(90deg);"};
  }
`;
Icon.defaultProps = {
  size: "l",
  glyph: "feeder-arrow",
};

export const TableHeaderWrapper = styled.section`
  display: flex;
  content-align: center;
  align-items: center;
`;
