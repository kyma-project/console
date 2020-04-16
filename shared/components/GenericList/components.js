import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'fundamental-react';

import ListActions from '../ListActions/ListActions';

export const BodyFallback = ({ children }) => (
  <tr>
    <td colSpan="100%">
      <div className="body-fallback">{children}</div>
    </td>
  </tr>
);

export const HeaderRenderer = ({ actions, headerRenderer }) => {
  let emptyColumn = [];
  if (actions.length) {
    emptyColumn = [<th key="actions-column" aria-label="actions-column"></th>];
  }
  return [
    headerRenderer().map((h, index) => <th key={h || index}>{h}</th>),
    ...emptyColumn,
  ];
};

export const RowRenderer = ({ entry, actions, rowRenderer, ...others }) => {
  const filteredActions = actions.filter(a =>
    a.skipAction ? !a.skipAction(entry) : true,
  );
  const resolvedRowRenderer = rowRenderer(entry);

  if (Array.isArray(resolvedRowRenderer)) {
    return (
      <DefaultRowRenderer
        {...others}
        entry={entry}
        actions={filteredActions}
        rowRenderer={resolvedRowRenderer}
      />
    );
  }
  return (
    <CollapsedRowRenderer
      {...others}
      entry={entry}
      actions={filteredActions}
      rowRenderer={resolvedRowRenderer}
    />
  );
};

const DefaultRowRenderer = ({
  key,
  entry,
  actions,
  rowRenderer,
  actionsStandaloneItems,
}) => {
  const cells = rowRenderer.map((cell, id) => <td key={id}>{cell}</td>);
  const actionsCell = (
    <td>
      <ListActions
        actions={actions}
        entry={entry}
        standaloneItems={actionsStandaloneItems}
      />
    </td>
  );

  return (
    <tr key={key}>
      {cells}
      {!!actions.length && actionsCell}
    </tr>
  );
};

const CollapsedRowRenderer = ({
  key,
  entry,
  actions,
  rowRenderer: {
    cells,
    collapseContent,
    withCollapseControl = true,
    showCollapseControl = true,
  },
  actionsStandaloneItems,
}) => {
  const [isOpen, setOpen] = useState(false);

  let rowRenderer = cells;
  if (withCollapseControl) {
    rowRenderer = [
      showCollapseControl ? (
        <Button
          data-testid={
            isOpen ? 'collapse-button-open' : 'collapse-button-close'
          }
          glyph={isOpen ? 'navigation-up-arrow' : 'navigation-down-arrow'}
          option="light"
          onClick={() => setOpen(!isOpen)}
          compact={true}
          typeAttr="button"
        />
      ) : (
        <></>
      ),
      ...cells,
    ];
  }

  const defaultRow = (
    <DefaultRowRenderer
      key={key}
      entry={entry}
      actions={actions}
      rowRenderer={rowRenderer}
      actionsStandaloneItems={actionsStandaloneItems}
    />
  );

  let collapseRow = collapseContent && (
    <tr role="row" className="collapse-content" data-testid="collapse-content">
      {collapseContent}
    </tr>
  );
  if (withCollapseControl) {
    collapseRow = isOpen ? collapseRow : null;
  }

  return (
    <>
      {defaultRow}
      {collapseRow}
    </>
  );
};
