import React, { useState } from 'react';
import { createElementClass, createModifierClass } from '@kyma-project/common';
import { plugins } from '@kyma-project/dc-markdown-render-engine';

import { CollapseArrow } from './styled';

export type Header = plugins.Header;
export type ActiveAnchors = plugins.ActiveAnchors;

const sumNumberOfHeaders = (headers: Header[]): number => {
  let sum: number = headers.length;
  for (const header of headers) {
    sum += sumNumberOfHeaders(header.children || []);
  }
  return sum;
};

interface HeaderItemProps {
  header: Header;
  className?: string;
  activeAnchors?: ActiveAnchors;
  collapseAlways: boolean;
}

const HeaderItem: React.FunctionComponent<HeaderItemProps> = ({
  header,
  className,
  activeAnchors,
  collapseAlways = false,
}) => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const showNode =
    activeAnchors && (activeAnchors as any)[header.level] === header.id;

  return (
    <li
      className={`${createElementClass(
        `${className}-list-item`,
      )} ${createModifierClass(
        `level-${header.level}`,
        `${className}-list-item`,
      )} ${
        showNode ? createElementClass(`${className}-list-item--active`) : ``
      }`}
    >
      {header.children && !collapseAlways ? (
        <CollapseArrow
          root={Boolean(!header.level) ? 1 : 0}
          size="s"
          glyph="feeder-arrow"
          open={showNode || collapse}
          onClick={() => {
            setCollapse(c => !c);
          }}
        />
      ) : null}
      <a href={`#${header.id}`}>{header.title}</a>
      {header.children && (
        <RenderedHeader
          headers={header.children}
          className={className ? className : ''}
          activeAnchors={activeAnchors}
          showNode={collapseAlways || showNode || collapse}
        />
      )}
    </li>
  );
};

export interface RenderedHeaderProps {
  headers?: Header[];
  className?: string;
  activeAnchors?: ActiveAnchors;
  showNode?: boolean;
}

export const RenderedHeader: React.FunctionComponent<RenderedHeaderProps> = ({
  headers,
  activeAnchors,
  showNode = false,
}) => {
  const context = plugins.useHeadersContext();
  if (!context) {
    return null;
  }

  const { headers: h, getActiveAnchors, className } = context;
  if (!headers) {
    headers = h;
  }
  const aa = getActiveAnchors();
  if (aa) {
    activeAnchors = aa;
  }

  const collapseAlways: boolean = !(sumNumberOfHeaders(headers) > 15);
  const anchorsList = headers.map(header => (
    <HeaderItem
      header={header}
      className={className}
      key={`${className}-list-item-${header.id}`}
      activeAnchors={activeAnchors}
      collapseAlways={collapseAlways}
    />
  ));

  return (
    <ul
      className={
        showNode ? `${createElementClass(`${className}-list-item--show`)}` : ''
      }
    >
      {anchorsList}
    </ul>
  );
};
