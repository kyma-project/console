import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './CreateRuntimeForm.scss';
import { InlineHelp } from 'fundamental-react/lib/InlineHelp';
import { CustomPropTypes } from '../../../shared/typechecking/CustomPropTypes';

const CreateRuntimeForm = ({
  formElementRef,
  onChange,
  onCompleted,
  onError,
  addRuntime,
}) => {
  const formValues = {
    name: useRef(null),
    description: useRef(null),
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
    } catch (e) {
      onError(`The runtime could not be created succesfully`, e.message || ``);
    }
  };

  const nameField = () => (
    <>
      <label className="fd-form__label" htmlFor="runtime-name">
        Name*:
        <InlineHelp
          placement="bottom-right"
          text="Name must be no longer than 63 characters, must start and end with a lowercase letter or number, and may contain lowercase letters, numbers, and dashes."
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
            Description*:
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

CreateRuntimeForm.propTypes = {
  formElementRef: CustomPropTypes.elementRef, // used to store <form> element reference
  isValid: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired, // args: title(string), message(string)
  onCompleted: PropTypes.func.isRequired, // args: title(string), message(string)
};

export default CreateRuntimeForm;
