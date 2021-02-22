import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { K8sNameInput, LabelSelectorInput, usePost } from '../..';

const ResourcesCreateForm = ({
  resourceType,
  resourceUrl,
  namespace,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) => {
  const [labels, setLabels] = useState({});
  const request = usePost();
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
      onCompleted(resourceData.metadata.name);
    } catch (e) {
      onError('ERROR', `Error while creating ${resourceType}: ${e}`);
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

ResourcesCreateForm.propTypes = {
  resourceType: PropTypes.string.isRequired,
  resourceUrl: PropTypes.string.isRequired,
  namespace: PropTypes.string,
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired, // used to store <form> element reference
  onChange: PropTypes.func,
  onError: PropTypes.func, // args: title(string), message(string)
  onCompleted: PropTypes.func, // args: name(string)
};

export default ResourcesCreateForm;
