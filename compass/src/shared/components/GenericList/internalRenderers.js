import React from 'react';
import { Popover } from 'fundamental-react/lib/Popover';
import { Menu } from 'fundamental-react/lib/Menu';
import { Button } from '@kyma-project/react-components';

export const renderActionElement = (actions, entry) =>
  Array.isArray(actions) &&
  ((
    <Popover
      body={
        <Menu>
          <Menu.List>
            {actions.map((
              action,
              id, // no unique key error appears here. 'key' is not passed further by Fd-react
            ) => (
              <Menu.Item
                onClick={() => action.handler(entry)}
                key={(entry.name || entry.id) + id}
              >
                {action.name}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu>
      }
      control={<Button glyph="vertical-grip" option="light" />}
      placement="bottom-end"
    />
  ) ||
    null);
