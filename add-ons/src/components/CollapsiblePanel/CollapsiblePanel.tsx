import React from 'react';
import classNames from 'classnames';
import { Panel, Button } from 'fundamental-react';
import './CollapsiblePanel.scss';

interface CollapsiblePanelProps {
  children: React.ReactNode;
  title: string;
  additionalHeaderContent?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  collapseDisabled?: boolean;
}

const CollapsiblePanel: React.FunctionComponent<CollapsiblePanelProps> = ({
  children,
  title,
  additionalHeaderContent,
  actions,
  className,
  isOpen = true,
  setIsOpen,
  collapseDisabled = false,
}) => (
  <Panel className={classNames('collapsible-panel', className)}>
    <Panel.Header>
      <Button
        className="fd-has-margin-right-xs"
        glyph={isOpen ? 'navigation-up-arrow' : 'navigation-down-arrow'}
        option="light"
        onClick={() => setIsOpen(!isOpen)}
        disabled={collapseDisabled}
      />
      <Panel.Head title={title} headingLevel={2} />
      {additionalHeaderContent}
      {actions && <Panel.Actions>{actions}</Panel.Actions>}
    </Panel.Header>
    <Panel.Body className={classNames('body', { 'body--closed': !isOpen })}>
      {children}
    </Panel.Body>
  </Panel>
);

export default CollapsiblePanel;
