import styled from 'styled-components';
import { Button, Icon, Panel, PanelHeader, Table } from 'fundamental-react';

export const StyledTable = styled.table`
  font-size: 14px;
  line-height: 1.42857;
  color: #32363a;
  font-family: '72';
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
  border-style: solid;
  border-width: 1px;
  color: #32363a;
  margin-bottom: 0;
  border: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  > tbody > tr {
    border: none;
    cursor: auto;
    background-color: #ffffff;
  }
  :last-child {
    margin-bottom: 0;
    margin-right: 0;
  }
`;
export const TableHead = styled.thead`
  font-size: 0.85714rem;
  line-height: 1.33333;
  font-weight: 400;
  text-transform: uppercase;
  border-bottom: solid 1px #eeeeef;
  border-top: solid 1px #eeeeef;
  background-color: #fafafa;
  color: #6a6d70;
  > tr {
    cursor: auto;
  }
`;

export const TableBody = styled.tbody``;

export const TableHeadCell = styled.th`
  text-align: left;
  padding: 16px 20px;
  border: none;
  font-weight: 400;
`;

export const TableRow = styled.tr`
  transition: background-color 125ms ease-in;
`;

export const TableCell = styled.td`
  text-align: left;
  padding: 16px 20px;
`;

export const LeftAlignedHeader = styled.th`
  text-align: left;
`;

export const StyledCode = styled.code``;

export const TableWrapper = styled.section``;

export const PageWrapper = styled.section`
  margin: 20px;
`;

export const TableHeader = styled.p`
  margin: 5px;
  font-size: 20px;
  font-weight: bold;
`;

export const TableContent = styled(Table)`
  && {
    margin-bottom: 0;
    border: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;

    > thead {
      border-bottom: solid 1px #eeeeef;
      border-top: solid 1px #eeeeef;

      > tr {
        cursor: auto;
      }
    }

    > tbody tr {
      border: none;
      cursor: auto;
    }
  }
`;

export const NotFoundMessage = styled.p`
  width: 100%;
  font-size: 18px;
  padding: 20px 0;
  margin: 0 auto;
  text-align: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

interface CollapseArrowProps {
  open?: boolean;
}

export const CollapseArrow = styled(Icon)`
  && {
    margin-left: 5px;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  &:before {
    transition: 0.3s ease;
    ${(props: CollapseArrowProps) => props.open && 'transform: rotate(90deg);'};
  }
`;

Icon.defaultProps = {
  size: 'l',
  glyph: 'feeder-arrow',
};

export const CollapseButton = styled(Button)`
  && {
    direction: rtl;
    margin-bottom: 20px;
  }
  &:before {
    margin-right: 0;
    margin-left: 8px;
    transition: 0.3s ease;
    ${(props: { open?: boolean }) => props.open && 'transform: rotate(90deg);'};
  }
`;

Button.defaultProps = {
  option: 'emphasized',
  glyph: 'feeder-arrow',
};

export const TablePanel = styled(Panel)`
  && {
    box-shadow: none;
  }
`;

export const TableHeaderWrapper = styled(PanelHeader)`
  && {
    border-top: solid 1px #eeeeef;
    border-bottom: none;
    box-shadow: none;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
    :hover {
      background-color: #fafafa;
    }
  }
`;

export const TextOverflowWrapper = styled.div`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
