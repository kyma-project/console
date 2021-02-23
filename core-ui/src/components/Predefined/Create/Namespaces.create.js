import React, { useRef, useState, useEffect } from 'react';

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
  namespace,
  refetchList,
}) => {
  const [labels, setLabels] = useState({});
  const request = usePost();
  const notification = useNotification();
  const formValues = {
    name: useRef(null),
  };

  useEffect(() => {
    const element = formValues.name.current;
    setImmediate(() => {
      if (element && typeof element.focus === 'function') element.focus();
    });
  }, [formValues.name]);

  function handleLabelsChanged(newLabels) {
    setLabels(newLabels);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const k8sLabels = { ...labels };
    const resourceData = {
      metadata: {
        name: formValues.name.current.value,
        namespace: namespace,
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
            _ref={formValues.name}
            id={`${resourceType}-name`}
            kind={resourceType}
          />
        </div>

        <LabelSelectorInput labels={labels} onChange={handleLabelsChanged} />
      </div>
    </form>
  );
};
