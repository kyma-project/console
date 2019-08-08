import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';

import RuntimeDetailsHeader from './RuntimeDetailsHeader/RuntimeDetailsHeader.component';
import RuntimeScenarios from './RuntimeScenarios/RuntimeScenarios.container';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

export const RuntimeQueryContext = React.createContext(null);

const RuntimeDetails = ({ runtimeQuery, deleteRuntime }) => {
  const { runtime, loading, error } = runtimeQuery;

  if (loading) return 'Loading...';

  if (!runtime) {
    if (error)
      return <ResourceNotFound resource="Runtime" breadcrumb="Runtimes" />;
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const labels = runtime.labels;
  const scenarios = labels && labels.scenarios ? labels.scenarios : [];

  return (
    <RuntimeQueryContext.Provider value={runtimeQuery}>
      <RuntimeDetailsHeader runtime={runtime} deleteRuntime={deleteRuntime} />

      <section className="fd-section">
        <Panel>
          <RuntimeScenarios runtimeId={runtime.id} scenarios={scenarios} />
        </Panel>
      </section>
    </RuntimeQueryContext.Provider>
  );
};

RuntimeDetails.propTypes = {
  runtimeQuery: PropTypes.object.isRequired,
  deleteRuntime: PropTypes.func.isRequired,
};

export default RuntimeDetails;
