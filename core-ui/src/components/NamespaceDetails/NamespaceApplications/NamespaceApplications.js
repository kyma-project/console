import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { UNBIND_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

import { GenericList } from 'react-shared';

NamespaceApplications.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceApplications({ namespace }) {
  const [unbindNamespace] = useMutation(UNBIND_NAMESPACE);

  const unbind = async ({ name }) => {
    try {
      await unbindNamespace({
        variables: {
          namespace: namespace.name,
          application: name,
        },
        refetchQueries: () => [
          {
            query: GET_NAMESPACE,
            variables: {
              name: namespace.name,
            },
          },
        ],
      });
    } catch (e) {
      console.warn(e);
      LuigiClient.uxManager().showAlert({
        text: `Cannot unbind ${name}: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  const actions = [
    {
      name: 'Unbind',
      handler: unbind,
    },
  ];

  return (
    <GenericList
      title="Connected Applications"
      notFoundMessage="No connected applications"
      entries={namespace.applications.map(name => ({ name }))}
      headerRenderer={() => ['Name']}
      rowRenderer={app => [app.name]}
      actions={actions}
    />
  );
}
