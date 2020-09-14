import React from 'react';
import { Popover, Menu, Button } from 'fundamental-react';
import './ListActions.scss';

import PropTypes from 'prop-types';
import CustomPropTypes from '../../typechecking/CustomPropTypes';

const AUTO_ICONS_BY_NAME = new Map([
  ['Edit', 'edit'],
  ['Delete', 'delete'],
  ['Details', 'detail-view'],
]);

const StandaloneAction = ({ action, entry, compact }) => {
  const icon = action.icon || AUTO_ICONS_BY_NAME.get(action.name);

  if (action.component) {
    return action.component(entry);
  }

  return (
    <Button
      onClick={() => action.handler(entry)}
      className="list-actions__standalone"
      option="light"
      glyph={icon}
      aria-label={action.name}
      typeAttr="button"
      compact={compact}
    >
      {icon ? '' : action.name}
    </Button>
  );
};

const ListActions = ({ actions, entry, standaloneItems = 2, compact }) => {
  if (!actions.length) {
    return null;
  }

  const listItems = actions.slice(standaloneItems, actions.length);

  return (
    <div className="list-actions">
      {actions.slice(0, standaloneItems).map(a => (
        <StandaloneAction
          key={a.name}
          action={a}
          entry={entry}
          compact={compact}
        />
      ))}
      {listItems.length ? (
        <Popover
          body={
            <Menu>
              <Menu.List>
                {listItems.map(a => (
                  <Menu.Item onClick={() => a.handler(entry)} key={a.name}>
                    {a.name}
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu>
          }
          control={
            <Button
              glyph="vertical-grip"
              option="light"
              aria-label="more-actions"
            />
          }
          placement="bottom-end"
        />
      ) : null}
    </div>
  );
};

ListActions.propTypes = {
  actions: CustomPropTypes.listActions,
  entry: PropTypes.any.isRequired,
  standaloneItems: PropTypes.number,
  compact: PropTypes.bool,
};

export default ListActions;
