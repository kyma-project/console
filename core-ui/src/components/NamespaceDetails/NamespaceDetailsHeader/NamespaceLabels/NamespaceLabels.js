import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { UPDATE_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

import { HeaderLabelsEditor } from 'react-shared';

NamespaceLabels.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceLabels({ namespace }) {
  const [updateNamespace] = useMutation(UPDATE_NAMESPACE);

  const updateLabels = async labels => {
    try {
      await updateNamespace({
        variables: { name: namespace.name, labels },
        refetchQueries: () => [
          {
            query: GET_NAMESPACE,
            variables: { name: namespace.name },
          },
        ],
      });
    } catch (e) {
      console.warn(e);
      LuigiClient.uxManager().showAlert({
        text: `Cannot update API: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  return (
    <HeaderLabelsEditor
      labels={namespace.labels || {}}
      onApply={updateLabels}
      columnSpan="1 / 3"
    />
  );
}
