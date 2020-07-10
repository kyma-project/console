import React from 'react';

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
  const deprecatedClasses = classnames('notification', {
    [`type-${type}`]: type,
    [`orientation-${orientation}`]: orientation,
    visible,
  });

  if (type !== 'success') {
    // deprecated notification
    return (
      <div className={deprecatedClasses} onClick={onClick}>
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
  }

  const classes = classnames('message-toast--wrapper', {
    visible,
  });
  // message toast
  return (
    <div className={classes} onClick={onClick}>
      <div className="fd-message-toast">{content || title}</div>
    </div>
  );
};

export default Notification;
