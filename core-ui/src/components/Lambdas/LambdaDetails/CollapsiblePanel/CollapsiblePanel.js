import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Panel, Button } from 'fundamental-react';
import './CollapsiblePanel.scss';

const CollapsiblePanel = ({
  children,
  title,
  className,
  isOpenInitially = true,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <Panel className={classNames('collapsible-panel', className)}>
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
        {children}
      </Panel.Body>
    </Panel>
  );
};

CollapsiblePanel.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  isOpenInitially: PropTypes.bool,
};

export default CollapsiblePanel;
