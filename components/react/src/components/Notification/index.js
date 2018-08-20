import React from 'react';

import Icon from '../Icon';

import {
  NotificationWrapper,
  NotificationHeader,
  NotificationTitleWrapper,
  NotificationIconWrapper,
} from './components';

const Notification = ({ title, color, icon, onClick, visible }) => (
  <NotificationWrapper color={color} onClick={onClick} visible={visible}>
    <NotificationHeader>
      <NotificationTitleWrapper>{title}</NotificationTitleWrapper>
      <NotificationIconWrapper>
        <Icon color={color} icon={icon} />
      </NotificationIconWrapper>
    </NotificationHeader>
  </NotificationWrapper>
);

export default Notification;
