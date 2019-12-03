import React from 'react';
import { Popover, Menu, Button, Icon } from 'fundamental-react';

const StandaloneAction = ({ action }) => {
  const props = {
    handler: entry => action.handler(entry),
    className: 'generic-list-actions__standalone',
  };

  if (action.icon) {
    return <Button glyph={action.icon} {...props} />;
  } else {
    return <Button {...props}>{action.name}</Button>;
  }
};

const ListActions = ({ actions, entry, standaloneItems = 2 }) => {
  if (!actions.length) {
    return null;
  }

  return (
    <div className="generic-list-actions">
      {actions.map(a => (
        <StandaloneAction action={a} entry={entry} />
      ))}
    </div>
  );
};

export default ListActions;
