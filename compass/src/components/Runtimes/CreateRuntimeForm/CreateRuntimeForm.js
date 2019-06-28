import React, { useRef } from 'react';
import { Mutation } from 'react-apollo';
import { Panel } from 'fundamental-react/lib/Panel';
import { ADD_RUNTIME } from '../gql';

const CreateRuntimeForm = () => {
  const formValues = {
    name: useRef(null),
    description: useRef(null),
  };
  return (
    <Mutation mutation={ADD_RUNTIME}>
      {createRuntime => (
        <Panel>
          <Panel.Header>
            <Panel.Head title="Create new runtime" />
          </Panel.Header>
          <Panel.Body>
            <form
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
                formValues.name.current.value = '';
                formValues.description.current.value = '';
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
                <button className="fd-button" type="submit">
                  Add Runtime
                </button>
              </div>
            </form>
          </Panel.Body>
        </Panel>
      )}
    </Mutation>
  );
};

export default CreateRuntimeForm;
