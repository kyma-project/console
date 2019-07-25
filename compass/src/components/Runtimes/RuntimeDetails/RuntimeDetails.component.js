import React from 'react';

import { Panel } from '@kyma-project/react-components';

import RuntimeDetailsHeader from './RuntimeDetailsHeader/RuntimeDetailsHeader.component';
import RuntimeScenarios from './RuntimeScenarios/RuntimeScenarios.component';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

const RuntimeDetails = ({
  runtimeQuery,
  deleteRuntime,
}) => {
  const runtime = (runtimeQuery && runtimeQuery.runtime) || {};
  const loading = runtimeQuery.loading;
  const error = runtimeQuery.error;
  
  if (!runtimeQuery || !runtimeQuery.runtime) {
    if (loading) return 'Loading...';
    if (error) return <ResourceNotFound resource="Runtime" breadcrumb="Runtimes"/>;
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  let scenarios = [];
  if (runtime.labels && runtime.labels.scenarios) {
    scenarios = runtime.labels.scenarios.map(scenario => {
      return { scenario };
    }); // list requires a list of objects
  }
  return (
    <>
      <RuntimeDetailsHeader
        runtime={runtime}
        deleteRuntime={deleteRuntime}
      />
      
      <section className="fd-section">
        <Panel>
          <RuntimeScenarios scenarios={scenarios}/>
        </Panel>
      </section>
    </>
  );
};

export default RuntimeDetails;
