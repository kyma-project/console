import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { SET_APPLICATION_SCENARIOS, DELETE_SCENARIO_LABEL } from '../../gql';

export default function ApplicationScenarioDecorator(ComponentToDecorate) {
  Decorator.propTypes = {
    setApplicationScenarios: PropTypes.func.isRequired,
    deleteApplicationScenarios: PropTypes.func.isRequired,
  };

  function Decorator(props) {
    async function updateScenarios(applicationId, scenarios) {
      if (scenarios.length) {
        await props.setApplicationScenarios(applicationId, scenarios);
      } else {
        await props.deleteApplicationScenarios(applicationId);
      }
    }
    return <ComponentToDecorate {...props} updateScenarios={updateScenarios} />;
  }

  return compose(
    graphql(SET_APPLICATION_SCENARIOS, {
      props: props => ({
        setApplicationScenarios: async (applicationId, scenarios) => {
          await props.mutate({
            variables: {
              id: applicationId,
              scenarios: scenarios,
            },
          });
        },
      }),
    }),
    graphql(DELETE_SCENARIO_LABEL, {
      props: props => ({
        deleteApplicationScenarios: async applicationId => {
          await props.mutate({
            variables: {
              id: applicationId,
            },
          });
        },
      }),
    }),
  )(Decorator);
}
