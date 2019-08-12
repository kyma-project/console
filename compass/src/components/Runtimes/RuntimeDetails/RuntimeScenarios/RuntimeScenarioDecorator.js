import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

import { SET_RUNTIME_SCENARIOS, DELETE_SCENARIO_LABEL } from '../../gql';

export default function RuntimeScenarioDecorator(ComponentToDecorate) {
  Decorator.propTypes = {
    setRuntimeScenarios: PropTypes.func.isRequired,
    deleteRuntimeScenarios: PropTypes.func.isRequired,
  };

  function Decorator(props) {
    async function updateScenarios(runtimeId, scenarios) {
      if (scenarios.length) {
        await props.setRuntimeScenarios(runtimeId, scenarios);
      } else {
        await props.deleteRuntimeScenarios(runtimeId);
      }
    }
    return <ComponentToDecorate {...props} updateScenarios={updateScenarios} />;
  }

  return compose(
    graphql(SET_RUNTIME_SCENARIOS, {
      props: props => ({
        setRuntimeScenarios: async (runtimeId, scenarios) => {
          await props.mutate({
            variables: {
              id: runtimeId,
              scenarios: scenarios,
            },
          });
        },
      }),
    }),
    graphql(DELETE_SCENARIO_LABEL, {
      props: props => ({
        deleteRuntimeScenarios: async runtimeId => {
          await props.mutate({
            variables: {
              id: runtimeId,
            },
          });
        },
      }),
    }),
  )(Decorator);
}
