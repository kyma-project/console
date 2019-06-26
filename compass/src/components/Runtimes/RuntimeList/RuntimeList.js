import React from 'react';
import { Query } from 'react-apollo';
import { Panel } from 'fundamental-react/lib/Panel';
import { GET_RUNTIMES } from '../queries';

const formValues = {
  name: null,
  description: null,
};

const RuntimeList = () => (
  <Query query={GET_RUNTIMES}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <Panel className="fd-has-margin-top-medium">
          <Panel.Body>
            <select name="dog">
              {data.runtimes.data.map(runtime => (
                <option key={runtime.id} value={runtime.name}>
                  {runtime.name}
                </option>
              ))}
            </select>
          </Panel.Body>
        </Panel>
      );
    }}
  </Query>
);

export default RuntimeList;
