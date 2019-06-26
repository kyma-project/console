import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Panel, PanelGrid } from 'fundamental-react/lib/Panel';

const ADD_RUNTIME = gql`
  mutation {
    createRuntime(
      in: {
        name: "testname"
        description: "Test21"
        labels: { test: ["hello", "there"] }
        annotations: { key: value }
      }
    ) {
      id
      description
      name
    }
  }
`;
let input;
const CreateRuntimeForm = () => (
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
              createRuntime({ variables: { name: 'abcd' } });
              input.value = '';
            }}
          >
            <div className="fd-form__set">
              <div className="fd-form__item">
                <label className="fd-form__label" htmlFor="input-1">
                  Name:
                </label>
                <input
                  className="fd-form__control"
                  ref={node => {
                    input = node;
                  }}
                  type="text"
                  id="input-1"
                  placeholder="Runtime name"
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

export default CreateRuntimeForm;
