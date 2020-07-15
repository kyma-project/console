import { useMicrofrontendContext, useConfig } from 'react-shared';
import { saveAs } from 'file-saver';

import { useMutation } from 'react-apollo';
import { SEND_NOTIFICATION } from 'gql';

export function useGetKubeconfig() {
  const { idToken, tenantId } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

  const domain = fromConfig('domain');
  const authHeader = { Authorization: `Bearer ${idToken}` };

  const showError = error => {
    console.log(error);
    sendNotification({
      variables: {
        content: `Could not download kubeconfig: ${error}`,
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
        autoClose: false,
      },
    });
  };

  return runtimeId => {
    const url = `https://kubeconfig-service.${domain}/kubeconfig/${tenantId}/${runtimeId}`;
    const name = `kubeconfig-${tenantId}-${runtimeId}.yml`;

    fetch(url, { headers: authHeader })
      .then(res => res.blob())
      .then(config => saveAs(config, name))
      .catch(showError);
  };
}
