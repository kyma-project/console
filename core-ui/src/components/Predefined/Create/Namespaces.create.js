import React, { useState } from 'react';

import {
  K8sNameInput,
  LabelSelectorInput,
  usePost,
  useNotification,
} from 'react-shared';

export const NamespacesCreate = ({
  formElementRef,
  onChange,
  resourceType,
  resourceUrl,
  refetchList,
}) => {
  const [name, setName] = useState('');
  const [labels, setLabels] = useState({});
  const request = usePost();
  const notification = useNotification();

  function handleLabelsChanged(newLabels) {
    setLabels(newLabels);
  }

  function handleNameChanged(event) {
    setName(event.target.value);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const k8sLabels = { ...labels };
    const resourceData = {
      metadata: {
        name,
        labels: k8sLabels,
      },
    };

    try {
      await request(resourceUrl, resourceData);
      notification.notifySuccess({ title: 'Succesfully created Resource' });
      refetchList();
    } catch (e) {
      notification.notifyError({
        title: 'Failed to delete the Resource',
        content: e.message,
      });
    }
  }

  return (
    // although HTML spec assigns the role by default to a <form> element, @testing-library ignores it
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <form
      role="form"
      onChange={onChange}
      ref={formElementRef}
      onSubmit={handleFormSubmit}
    >
      <div className="fd-form__set">
        <div className="fd-form__item">
          <K8sNameInput
            onChange={handleNameChanged}
            id={`${resourceType}-name`}
            kind={resourceType}
          />
        </div>

        <LabelSelectorInput labels={labels} onChange={handleLabelsChanged} />
      </div>
    </form>
  );
};
