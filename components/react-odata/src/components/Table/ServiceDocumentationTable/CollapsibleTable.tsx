import React, { Fragment, useState } from 'react';
import CollapsibleAnnotation from './CollapsibleAnnotation';
import { makeUnique } from '../utils';
import { Node } from '../../../types';
import {
  TableHead,
  TableHeadCell,
  TableBody,
  StyledTable,
  CollapseArrow,
  TableRow,
  TableCell,
} from '../../styled/styled';
interface Props {
  data: Node;
}

const CollapsibleTable: React.FunctionComponent<Props> = ({ data }) => {
  const attributesColumn: string[] = data.children
    .flatMap((elem: { attributes: any }) => Object.keys(elem.attributes))
    .filter(makeUnique);

  const specialData: string[] = data.children
    .map(
      (elem: Node) =>
        (elem.children && elem.children[0] && elem.children[0].name) || '',
    )
    .filter((elem: string) => !!elem)
    .filter(makeUnique);

  const columnHeaders: string[] = [...attributesColumn, ...specialData];

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          {columnHeaders.map((elem: string, index: number) => (
            <TableHeadCell key={index}>{elem}</TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.children.map((child: Node, index: number) => {
          const specialHeader: Node = child.children[0];
          if (specialHeader && specialHeader.name === 'Collection') {
            const [show, setShow] = useState<boolean>(false);
            return (
              <Fragment key={index}>
                <TableRow>
                  {columnHeaders.map((el: string, idx: number) => (
                    <TableCell key={idx}>
                      {child.attributes[el] ||
                        (specialHeader && specialHeader.name === el && (
                          <CollapseArrow
                            open={show}
                            clickHandler={() => setShow(!show)}
                          />
                        ))}
                    </TableCell>
                  ))}
                </TableRow>
                {show && (
                  <TableRow>
                    <TableCell colSpan={columnHeaders.length}>
                      <CollapsibleAnnotation data={specialHeader} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          }

          return (
            <TableRow key={index}>
              {columnHeaders.map((el: string, idx: number) => (
                <TableCell key={idx}>
                  {child.attributes[el] ||
                    (specialHeader &&
                      specialHeader.name === el &&
                      specialHeader.value)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </StyledTable>
  );
};

export default CollapsibleTable;
