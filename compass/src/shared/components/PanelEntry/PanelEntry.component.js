import { Panel } from '@kyma-project/react-components';
import React from 'react';

export const PanelEntry = ({ title, content }) => (
  <Panel>
    <Panel.Body>
      <p className="fd-has-color-text-4 fd-has-margin-bottom-none">{title}</p>
      {content}
    </Panel.Body>
  </Panel>
);

//export default PanelEntry;
