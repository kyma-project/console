import React, { useRef } from 'react';
import { Mutation } from 'react-apollo';
import { ADD_RUNTIME } from '../gql';

const CreateRuntimeForm = ({ formElement, onChange, isValid = false }) => {
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

  return (
    <Mutation mutation={ADD_RUNTIME}>
      {createRuntime => (
        <form
          onChange={onChange}
          ref={formElement}
          style={{ width: '28em' }}
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
              </label>
              <input
                className="fd-form__control"
                ref={formValues.name}
                type="text"
                id="runtime-name"
                placeholder="Runtime name"
                aria-required="true"
                required
              />
            </div>
            <div className="fd-form__item">
              <label className="fd-form__label" htmlFor="runtime-desc">
                Description:
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
