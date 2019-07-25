import React from 'react';

import { Panel } from '@kyma-project/react-components';

import RuntimeDetailsHeader from './RuntimeDetailsHeader/RuntimeDetailsHeader.component';
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
  return (
    <>
      <RuntimeDetailsHeader
        runtime={runtime}
        deleteRuntime={deleteRuntime}
      />
      
      <section className="fd-section">
        <Panel>
          <Panel.Header>
            <Panel.Head title="Have you ever wondered what's inside a runtime?" />
          </Panel.Header>
        </Panel>
      </section>
    </>
  );
};

export default RuntimeDetails;
