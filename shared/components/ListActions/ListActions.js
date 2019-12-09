import React from 'react';
import { Popover, Menu, Button } from 'fundamental-react';
import './ListActions.scss';
import PropTypes from 'prop-types';

const AUTO_ICONS_BY_NAME = new Map([['Edit', 'edit'], ['Delete', 'delete']]);

const StandaloneAction = ({ action, entry }) => {
  const icon = action.icon || AUTO_ICONS_BY_NAME.get(action.name);

  return (
    <Button
      onClick={() => action.handler(entry)}
      className="list-actions__standalone"
      option="light"
      glyph={icon}
      aria-label={action.name}
    >
      {icon ? '' : action.name}
    </Button>
  );
};

const ListActions = ({ actions, entry, standaloneItems = 2 }) => {
  if (!actions.length) {
    return null;
  }

  const listItems = actions.slice(standaloneItems, actions.length);

  return (
    <div className="list-actions">
      {actions.slice(0, standaloneItems).map(a => (
        <StandaloneAction key={a.name} action={a} entry={entry} />
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
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      handler: PropTypes.func.isRequired,
    }),
  ).isRequired,
  entry: PropTypes.any.isRequired,
  standaloneItems: PropTypes.number,
};

export default ListActions;
