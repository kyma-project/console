import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { UPDATE_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

import { Icon } from 'fundamental-react';
import { ModalWithForm, CustomPropTypes, Tooltip } from 'react-shared';
import LabelSelectorInput from 'components/LabelSelectorInput/LabelSelectorInput';

EditNamespaceLabelsForm.propTypes = {
  namespace: PropTypes.object.isRequired,
  formElementRef: CustomPropTypes.ref,
};

function EditNamespaceLabelsForm({ namespace, formElementRef }) {
  const [updateNamespace] = useMutation(UPDATE_NAMESPACE);
  const [labels, setLabels] = React.useState(namespace.labels);

  async function handleSubmit() {
    try {
      await updateNamespace({
        variables: { name: namespace.name, labels },
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
        text: `Cannot update API: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      className="fd-has-padding-bottom-m"
    >
      <LabelSelectorInput labels={labels} onChange={setLabels} />
    </form>
  );
}

EditNamespaceLabelsForm.propTypes = { namespace: PropTypes.object.isRequired };

export default function EditNamespaceLabelsModal({ namespace }) {
  const modalOpeningComponent = (
    <span className="fd-has-display-inline-block fd-has-margin-left-tiny cursor-pointer">
      <Tooltip content="Edit labels" position="top">
        <Icon glyph="edit" aria-label="Edit labels" />
      </Tooltip>
    </span>
  );

  return (
    <ModalWithForm
      title={`Edit labels for "${namespace.name}" namespace`}
      confirmText="Save"
      modalOpeningComponent={modalOpeningComponent}
      renderForm={props => (
        <EditNamespaceLabelsForm namespace={namespace} {...props} />
      )}
    />
  );
}
