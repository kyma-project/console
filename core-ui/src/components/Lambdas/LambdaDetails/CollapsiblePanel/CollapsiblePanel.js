import React, { useState } from 'react';
import { Panel, Button } from 'fundamental-react';
import './CollapsiblePanel.scss';

const CollapsiblePanel = ({ content, title, isOpenInitially = true }) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <Panel className="collapsible-panel">
      <Panel.Header>
        <Panel.Head title={title} />
        <Panel.Actions>
          <Button
            glyph={isOpen ? 'navigation-up-arrow' : 'navigation-down-arrow'}
            option="light"
            onClick={() => setIsOpen(!isOpen)}
          />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body className={isOpen ? 'body body--open' : 'body body--closed'}>
        {content}
      </Panel.Body>
    </Panel>
  );
};

export default CollapsiblePanel;
