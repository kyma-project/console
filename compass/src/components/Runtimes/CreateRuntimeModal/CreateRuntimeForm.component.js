import React, { useRef } from 'react';
import { Mutation } from 'react-apollo';
import { ADD_RUNTIME } from '../gql';
import './CreateRuntimeForm.scss';
import { InlineHelp } from 'fundamental-react/lib/InlineHelp';

const CreateRuntimeForm = ({
  formElement,
  onChange,
  onCompleted,
  onError,
  isValid = false,
}) => {
  const formValues = {
    name: useRef(null),
    description: useRef(null),
  };

  const resetForm = fieldRefs => {
    Object.keys(fieldRefs).forEach(
      field => (fieldRefs[field].current.value = ''),
    );
    //TODO: security
  };
  const nameRegex = new RegExp('[a-z0-9]([-a-z0-9]*[a-z0-9])?');

  return (
    <Mutation
      mutation={ADD_RUNTIME}
      onError={onError}
      onCompleted={onCompleted}
    >
      {(createRuntime, { loading, error }) => (
        <form
          onChange={onChange}
          ref={formElement}
          style={{ width: '30em' }}
          onSubmit={e => {
            e.preventDefault();
            createRuntime({
              variables: {
                in: {
                  name: formValues.name.current.value,
                  description: formValues.description.current.value,
                  labels: { test: ['hello', 'there'] },
                },
              },
            });
            resetForm(formValues);
          }}
        >
          <div className="fd-form__set">
            <div className="fd-form__item">
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
                pattern="[a-z0-9]([-a-z0-9]*[a-z0-9])?"
              />
            </div>
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
      )}
    </Mutation>
  );
};

export default CreateRuntimeForm;
