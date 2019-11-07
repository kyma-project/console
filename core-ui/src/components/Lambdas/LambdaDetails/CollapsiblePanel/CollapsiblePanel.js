import React, { useState } from 'react';
import { Panel, Button } from 'fundamental-react';
import './CollapsiblePanel.scss';

const CollapsiblePanel = ({
  children,
  title,
  isOpenInitially = true,
  addAction,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <Panel className="collapsible-panel">
      <Panel.Header>
        <Panel.Head title={title} />
        <Panel.Actions>
          {addAction && <Button glyph="add" onClick={addAction} compact />}
          <Button
            glyph={isOpen ? 'navigation-up-arrow' : 'navigation-down-arrow'}
            option="light"
            onClick={() => setIsOpen(!isOpen)}
            compact
          />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body
        className={
          isOpen ? 'body body--open' : 'body body--closed' /* use classnames*/
        }
      >
        {children}
      </Panel.Body>
    </Panel>
  );
};

export default CollapsiblePanel;
