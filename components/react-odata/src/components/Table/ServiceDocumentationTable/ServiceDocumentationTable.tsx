import React, { Fragment, useState, useEffect, useRef } from 'react';
import CollapsibleTable from './CollapsibleTable';
import { Node } from '../../../types';

import { PanelActions, PanelHead } from 'fundamental-react';
import {
  StyledTable,
  TableHead,
  TableHeadCell,
  TablePanel,
  TableRow,
  TableCell,
  TableWrapper,
  TableBody,
  CollapseArrow,
  TableHeaderWrapper,
} from '../../styled/styled';

interface Props {
  data: Node[];
  showAll: boolean;
}

const inverseArrayValue = (arr: boolean[], index: number) => {
  const data: boolean[] = [...arr];
  data[index] = !data[index];
  return data;
};

const ServiceDocumentationTable: React.FunctionComponent<Props> = ({
  data,
  showAll,
}) => {
  function usePrevious(value: boolean) {
    const ref = useRef<boolean>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const [show, setShow] = useState<boolean>(showAll);

  const prevShowAll = usePrevious(showAll);

  useEffect(() => {
    if (prevShowAll !== undefined && prevShowAll !== showAll) {
      setShow(showAll);
    }
  }, [prevShowAll, showAll]);
  const [showPart, setShowPart] = useState<boolean[]>(
    Array(data.length).fill(false),
  );

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <TableWrapper>
      <TablePanel>
        <TableHeaderWrapper
          className="asdfg"
          onClick={() => {
            if (show) {
              setShowPart(Array(data.length).fill(false));
            }
            setShow(!show);
          }}
        >
          <PanelHead title={'Service Documentation / Annotations'} />
          <PanelActions>
            <CollapseArrow
              open={show}
              clickHandler={() => {
                if (show) {
                  setShowPart(Array(data.length).fill(false));
                }
                setShow(!show);
              }}
            />
          </PanelActions>
        </TableHeaderWrapper>

        {show && (
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableHeadCell>{'Target'}</TableHeadCell>
                <TableHeadCell>{'Annotation'}</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((value: Node, index: number) => {
                const showEl = showPart[index];
                return (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell>{value.attributes.Target}</TableCell>
                      <TableCell>
                        <CollapseArrow
                          open={showEl}
                          clickHandler={() =>
                            setShowPart(inverseArrayValue(showPart, index))
                          }
                        />
                      </TableCell>
                    </TableRow>
                    {showEl && (
                      <tr>
                        <td colSpan={2}>
                          <CollapsibleTable data={value} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </StyledTable>
        )}
      </TablePanel>
    </TableWrapper>
  );
};

export default ServiceDocumentationTable;
