import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_LAMBDA } from '../../../gql/queries';

import EntryNotFound from '../../EntryNotFound/EntryNotFound';
import Spinner from '../../../shared/components/Spinner/Spinner';
import LambdaDetails from './LambdaDetails';

LambdaDetailsWrapper.propTypes = {
  lambdaName: PropTypes.string.isRequired,
};

const MAX_POLLING_TIME = 5000;
const POLL_INTERVAL = 500;

export default function LambdaDetailsWrapper({ lambdaName }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const { data, error, loading, stopPolling } = useQuery(GET_LAMBDA, {
    variables: {
      name: lambdaName,
      namespace,
    },
    fetchPolicy: 'no-cache',
    pollInterval: POLL_INTERVAL,
  });

  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading) {
    return <Spinner />;
  }
  if (data && !data.function) {
    setTimeout(() => {
      stopPolling();
    }, MAX_POLLING_TIME);
    return <EntryNotFound entryType="Lambda" entryId={lambdaName} />;
  }
  if (data && data.function) {
    stopPolling();
    return <LambdaDetails lambda={data.function} />;
  }
}
