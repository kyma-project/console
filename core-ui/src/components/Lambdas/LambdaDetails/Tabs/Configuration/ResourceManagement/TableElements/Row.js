import React from 'react';

import { Panel } from 'fundamental-react';

export function Row({ title, description, action }) {
  return (
    <Panel className="has-box-shadow-none">
      <Panel.Header className="has-padding-none has-none-border-bottom is-block">
        <Panel.Head title={title} description={description} />
        <Panel.Actions>{action}</Panel.Actions>
      </Panel.Header>
    </Panel>
  );
}
