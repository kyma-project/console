import React from 'react';
import { Popover, Menu, Button } from 'fundamental-react';

const AUTO_ICONS_BY_NAME = new Map([['Edit', 'edit'], ['Delete', 'delete']]);

const StandaloneAction = ({ action }) => {
  const icon = action.icon || AUTO_ICONS_BY_NAME.get(action.name);

  return (
    <Button
      onClick={entry => action.handler(entry)}
      className="generic-list-actions__standalone"
      option="light"
      glyph={icon}
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
    <div className="generic-list-actions">
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
          control={<Button glyph="vertical-grip" option="light" />}
          placement="bottom-end"
        />
      ) : null}
    </div>
  );
};

export default ListActions;
