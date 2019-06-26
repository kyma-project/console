import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const ADD_RUNTIME = gql`
  mutation {
    createRuntime(
      in: {
        name: "Test"
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

const Runtimes = () => {
  let input;

  return (
    <Mutation mutation={ADD_RUNTIME}>
      {(createRuntime, { data }) => (
        <div>
          <h1>Runtimes</h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              createRuntime({ variables: {} });
              input.value = '';
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Runtime</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

export default Runtimes;
