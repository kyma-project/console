import React, { Fragment } from 'react';

import Icon from '../Icon';
import Separator from '../Separator';

import {
  NotificationWrapper,
  NotificationHeader,
  NotificationTitleWrapper,
  NotificationIconWrapper,
  NotificationBody,
} from './components';

const Notification = ({ title, color, icon, onClick, content, visible }) => (
  <NotificationWrapper color={color} onClick={onClick} visible={visible}>
    <NotificationHeader>
      <NotificationTitleWrapper>{title}</NotificationTitleWrapper>
      <NotificationIconWrapper>
        <Icon style={{ color: color }} glyph={icon} />
      </NotificationIconWrapper>
    </NotificationHeader>
    {content && (
      <Fragment>
        <Separator />
        <NotificationBody>{content}</NotificationBody>
      </Fragment>
    )}
  </NotificationWrapper>
);

export default Notification;
