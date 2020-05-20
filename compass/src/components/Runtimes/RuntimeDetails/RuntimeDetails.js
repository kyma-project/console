import React from 'react';
import PropTypes from 'prop-types';

import RuntimeDetailsHeader from './RuntimeDetailsHeader/RuntimeDetailsHeader.component';
import RuntimeScenarios from './RuntimeScenarios/RuntimeScenarios.container';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import MetadataTable from 'components/Shared/MetadataTable/MetadataTable';

import './RuntimeDetails.scss';

import { useQuery } from 'react-apollo';
import { GET_RUNTIME } from '../gql';

export const RuntimeQueryContext = React.createContext(null);

const RuntimeDetails = ({ runtimeId }) => {
  const runtimeQuery = useQuery(GET_RUNTIME, {
    variables: { id: runtimeId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const {
    data: { runtime },
    loading,
    error,
  } = runtimeQuery;

  if (loading) return 'Loading...';

  if (!runtime && !error) {
    return (
      <ResourceNotFound
        resource="Runtime"
        breadcrumb="Runtimes"
        navigationPath="/"
      />
    );
  }
  if (error) return `Error! ${error.message}`;

  const labels = runtime.labels;
  const scenarios = labels && labels.scenarios ? labels.scenarios : [];

  return (
    <RuntimeQueryContext.Provider value={runtimeQuery}>
      <RuntimeDetailsHeader runtime={runtime} />
      <section className="runtime-details-body">
        <RuntimeScenarios runtimeId={runtime.id} scenarios={scenarios} />
        <MetadataTable ownerType="Runtime" labels={labels} />
      </section>
    </RuntimeQueryContext.Provider>
  );
};

RuntimeDetails.propTypes = {
  runtimeId: PropTypes.string.isRequired,
};

export default RuntimeDetails;
