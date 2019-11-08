import { useContext } from 'react';
import gql from 'graphql-tag';
import createUseContext from 'constate';
import { useSubscription } from '@apollo/react-hooks';
import { NotificationsService } from '@kyma-project/common';
import { LuigiContext } from './LuigiContext.service';

import { ConfigurationsService } from '../services';
import { Configuration } from '../types';
import { NOTIFICATION, CONFIGURATION_VARIABLE } from '../constants';
import { SubscriptionType } from './types';

const subscriptionFields = `
  name
  urls
  labels
`;

export const CLUSTER_ADDONS_CONFIGURATION_EVENT_SUBSCRIPTION = gql`
  subscription clusterAddonsConfigurationEvent {
    clusterAddonsConfigurationEvent {
      type
      addonsConfiguration {
        ${subscriptionFields}
      }
    }
  }
`;

export const ADDONS_CONFIGURATION_EVENT_SUBSCRIPTION = gql`
  subscription addonsConfigurationEvent(
    $namespace: String!
  ) {
    addonsConfigurationEvent(
      namespace: $namespace
    ) {
      type
      addonsConfiguration {
        ${subscriptionFields}
      }
    }
  }
`;

interface SubscriptionPayload {
  clusterAddonsConfigurationEvent?: {
    type: SubscriptionType;
    addonsConfiguration: Configuration;
  };
  addonsConfigurationEvent?: {
    type: SubscriptionType;
    addonsConfiguration: Configuration;
  };
}

interface AddonsConfigurationSubscriptionVariables {
  namespace?: string;
}

const useSubscriptions = () => {
  const { namespaceId: currentNamespace } = useContext(LuigiContext);
  const { setOriginalConfigs } = useContext(ConfigurationsService);
  const { successNotification, errorNotification } = useContext(
    NotificationsService,
  );

  const onAdd = (item: Configuration) => {
    successNotification({
      title: NOTIFICATION.ADD_CONFIGURATION.TITLE,
      content: NOTIFICATION.ADD_CONFIGURATION.CONTENT.replace(
        CONFIGURATION_VARIABLE,
        item.name,
      ),
    });
    setOriginalConfigs(configs => [...configs, item]);
  };

  const onUpdate = (item: Configuration) => {
    successNotification({
      title: NOTIFICATION.UPDATE_CONFIGURATION.TITLE,
      content: NOTIFICATION.UPDATE_CONFIGURATION.CONTENT.replace(
        CONFIGURATION_VARIABLE,
        item.name,
      ),
    });
    setOriginalConfigs(configs =>
      configs.map(c => (c.name === item.name ? { ...c, ...item } : c)),
    );
  };

  const onDelete = (item: Configuration) => {
    successNotification({
      title: NOTIFICATION.DELETE_CONFIGURATION.TITLE,
      content: NOTIFICATION.DELETE_CONFIGURATION.CONTENT.replace(
        CONFIGURATION_VARIABLE,
        item.name,
      ),
    });
    setOriginalConfigs(configs => configs.filter(c => c.name !== item.name));
  };

  const subscription = currentNamespace
    ? ADDONS_CONFIGURATION_EVENT_SUBSCRIPTION
    : CLUSTER_ADDONS_CONFIGURATION_EVENT_SUBSCRIPTION;

  useSubscription<
    SubscriptionPayload,
    AddonsConfigurationSubscriptionVariables
  >(subscription, {
    variables: {
      namespace: currentNamespace,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const { data, error } = subscriptionData;

      if (error) {
        // errorNotification('Error', ERRORS.SERVER);
        errorNotification({
          title: 'Error',
          content: '',
        });
        return;
      }
      if (!data) {
        return;
      }

      const {
        clusterAddonsConfigurationEvent,
        addonsConfigurationEvent,
      } = data;
      const event = currentNamespace
        ? addonsConfigurationEvent
        : clusterAddonsConfigurationEvent;
      if (!event) {
        return;
      }
      const type = event.type;
      const addonsConfiguration = event.addonsConfiguration;

      if (!type || !addonsConfiguration) {
        return;
      }

      switch (type) {
        case SubscriptionType.ADD: {
          onAdd(addonsConfiguration);
          break;
        }
        case SubscriptionType.UPDATE: {
          onUpdate(addonsConfiguration);
          break;
        }
        case SubscriptionType.DELETE: {
          onDelete(addonsConfiguration);
          break;
        }
        default:
          break;
      }
    },
  });
};

const { Provider } = createUseContext(useSubscriptions);
export { Provider as SubscriptionsProvider };
