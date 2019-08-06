import React from 'react';
import { Panel } from '@kyma-project/react-components';

import RuntimeDetailsHeader from './RuntimeDetailsHeader/RuntimeDetailsHeader.component';
import RuntimeScenarios from './RuntimeScenarios/RuntimeScenarios.container';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

export const RuntimeQueryContext = React.createContext(null);

const RuntimeDetails = ({ runtimeQuery, deleteRuntime }) => {
  const runtime = (runtimeQuery && runtimeQuery.runtime) || {};
  const loading = runtimeQuery.loading;
  const error = runtimeQuery.error;

  if (!runtimeQuery || !runtimeQuery.runtime) {
    if (loading) return 'Loading...';
    if (error)
      return <ResourceNotFound resource="Runtime" breadcrumb="Runtimes" />;
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  const labels = runtimeQuery.runtime.labels;
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

export default RuntimeDetails;
