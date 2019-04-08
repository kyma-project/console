import React from 'react';
import { Notification } from '@kyma-project/react-components';

import { Notification as NotificationType } from '../../types';

interface Props {
  notification: NotificationType;
  showNotification: boolean;
  hideNotification: () => void;
}

export const Component: React.FunctionComponent<Props> = ({
  notification,
  showNotification,
  hideNotification,
}) => {
  return (
    <Notification
      {...notification}
      orientation="bottom"
      visible={showNotification}
      onClick={hideNotification}
    />
  );
};

export default Component;
