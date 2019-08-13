import React from 'react';
import { Icon } from 'fundamental-react';

import {
  NotificationWrapper,
  NotificationHeader,
  NotificationTitleWrapper,
  NotificationIconWrapper,
  NotificationBody,
  NotificationSeparator,
} from './styled';

export interface NotificationProps {
  title: string;
  color?: string;
  icon?: string;
  content: React.ReactNode;
  visible: boolean;
  onClick: () => void;
  orientation: string;
}

export const Notification: React.FunctionComponent<NotificationProps> = ({
  title,
  color,
  icon,
  onClick,
  content,
  visible,
  orientation = 'bottom',
}) => (
  <NotificationWrapper
    color={color}
    onClick={onClick}
    visible={visible}
    orientation={orientation}
  >
    <NotificationHeader>
      <NotificationTitleWrapper>{title}</NotificationTitleWrapper>
      <NotificationIconWrapper>
        {icon && <Icon style={{ color: color }} glyph={icon} />}
      </NotificationIconWrapper>
    </NotificationHeader>
    {content && (
      <>
        {/* Fix it */}
        <NotificationSeparator />
        <NotificationBody>{content}</NotificationBody>
      </>
    )}
  </NotificationWrapper>
);
