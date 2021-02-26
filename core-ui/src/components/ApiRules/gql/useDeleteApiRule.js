import LuigiClient from '@luigi-project/client';

import { useDelete, handleDelete } from 'react-shared';
import { formatMessage as injectVariables } from 'components/Lambdas/helpers/misc';
import { API_RULE_URL } from '../constants';

export function useDeleteApiRule() {
  const namespace = LuigiClient.getContext().namespaceId;

  const deleteAPIRule = useDelete();

  async function handleResourceDelete(name) {
    return await handleDelete(
      'apirules',
      null,
      name,
      () =>
        deleteAPIRule(
          injectVariables(API_RULE_URL, {
            namespace: namespace,
            name: name,
          }),
        ),
      () => {},
    );
  }

  return handleResourceDelete;
}
