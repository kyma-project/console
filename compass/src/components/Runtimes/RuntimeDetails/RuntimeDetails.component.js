import React from 'react';
import RuntimeDetailsHeader from './RuntimeDetailsHeader/RuntimeDetailsHeader.component';

const RuntimeDetails = ({
  runtimeQuery,
  deleteRuntime,
}) => {
  const runtime = (runtimeQuery && runtimeQuery.runtime) || {};
  console.log(runtimeQuery)
  const loading = runtimeQuery.loading;
  const error = runtimeQuery.error;
  if (loading) return 'Loading...';
  if (error) {
    if (!runtimeQuery || !runtimeQuery.runtime) {
      console.log('xxx');
    } else {
      return `Error! ${error.message}`;
    }
  }
  return (
    <>
      <RuntimeDetailsHeader
        runtime={runtime}
        deleteRuntime={deleteRuntime}
      />
      <section className="fd-section">
        tetetetetetetetetet
      </section>
    </>
  );
};

export default RuntimeDetails;
