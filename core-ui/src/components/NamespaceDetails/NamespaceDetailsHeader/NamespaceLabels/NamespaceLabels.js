import React from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { UPDATE_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

import { HeaderLabelsEditor, useNotification } from 'react-shared';

NamespaceLabels.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceLabels({ namespace }) {
  const [updateNamespace] = useMutation(UPDATE_NAMESPACE);
  const notification = useNotification();

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
      notification.notifySuccess({
        content: 'Labels updated successfully',
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Cannot update labels: ${e.message}.`,
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
