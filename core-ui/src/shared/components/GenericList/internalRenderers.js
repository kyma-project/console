import React from 'react';
import { Popover } from 'fundamental-react/Popover';
import { Menu } from 'fundamental-react/Menu';
import { Button } from '@kyma-project/react-components';

export const renderActionElement = (actions, entry) =>
  !Array.isArray(actions) ? null : (
    <Popover
      body={
        <Menu>
          <Menu.List>
            {actions.map(action => (
              <Menu.Item
                onClick={() => action.handler(entry)}
                key={action.name}
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
  );
