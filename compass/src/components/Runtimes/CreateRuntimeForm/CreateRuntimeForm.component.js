import React, { useRef, useEffect, useState } from 'react';
import './CreateRuntimeForm.scss';
import { InlineHelp } from 'fundamental-react/lib/InlineHelp';

const CreateRuntimeForm = ({
  formElementRef,
  onChange,
  onCompleted,
  onError,
  addRuntime,
  getRuntimeNames,
}) => {
  const formValues = {
    name: useRef(null),
    description: useRef(null),
  };

  const [runtimeNames, setRuntimeNames] = useState([]);

  useEffect(() => {
    if (Array.isArray(runtimeNames) && !runtimeNames.length)
      fetchRuntimeNames();
  });

  const fetchRuntimeNames = async () => {
    const allRuntimes = await getRuntimeNames.refetch();
    if (
      !allRuntimes.errors &&
      allRuntimes &&
      allRuntimes.data &&
      allRuntimes.data.runtimes &&
      allRuntimes.data.runtimes.data
    ) {
      setRuntimeNames(allRuntimes.data.runtimes.data.map(r => r.name));
    } else {
      setRuntimeNames(null);
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const runtimeName = formValues.name.current.value;
    try {
      await addRuntime({
        name: runtimeName,
        description: formValues.description.current.value,
        labels: { test: ['hello', 'there'] },
      });
      onCompleted(runtimeName, `Runtime created succesfully`);
    } catch {
      onError(runtimeName, `The runtime could not be created succesfully`);
    }
  };

  const handleNameChanged = async () => {
    formValues.name.current.setCustomValidity(
      runtimeNames.includes(formValues.name.current.value)
        ? 'This name is already taken by another runtime'
        : '',
    );
  };

  const nameField = () => (
    <>
      <label className="fd-form__label" htmlFor="runtime-name">
        Name:
        <InlineHelp
          placement="bottom-right"
          text="Name must be no longer than 63 characters, must start and end with a lowercase letter or number, and may contain lowercase letters, numbers, and hyphens."
        />
      </label>
      <input
        className="fd-form__control"
        ref={formValues.name}
        type="text"
        id="runtime-name"
        placeholder="Runtime name"
        aria-required="true"
        required
        pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$"
        onChange={e => handleNameChanged(e.target)}
      />
    </>
  );

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      style={{ width: '30em' }}
      onSubmit={handleFormSubmit}
    >
      <div className="fd-form__set">
        <div className="fd-form__item">{nameField()}</div>
        <div className="fd-form__item">
          <label className="fd-form__label" htmlFor="runtime-desc">
            Description:
            <InlineHelp placement="bottom-right" text="Must not be empty" />
          </label>

          <input
            className="fd-form__control"
            ref={formValues.description}
            type="text"
            id="runtime-desc"
            placeholder="Runtime description"
            aria-required="true"
            required
          />
        </div>
      </div>
    </form>
  );
};

export default CreateRuntimeForm;
