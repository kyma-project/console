import React, { Fragment } from 'react';

import { Icon } from 'fundamental-react';
import './Notification.scss';
import classnames from 'classnames';

export const Notification = ({
  title,
  type,
  icon,
  onClick,
  content,
  visible,
  orientation = 'top',
}) => {
  const classes = classnames('notification', {
    [`type-${type}`]: type,
    [`orientation-${orientation}`]: orientation,
    visible,
  });
  return (
    <div className={classes} onClick={onClick}>
      <div className="notification-header">
        <span className="notification-title">{title}</span>
        <div className="notification-icon">
          <span className="notification-icon">
            <Icon glyph={icon} />
          </span>
        </div>
      </div>
      {content && (
        <>
          <div className="notification-separator" />
          <div className="notification-body">{content}</div>
        </>
      )}
    </div>
  );
};

export default Notification;
