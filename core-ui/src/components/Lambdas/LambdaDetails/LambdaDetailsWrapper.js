import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_LAMBDA } from '../../../gql/queries';
import { REFETCH_TIMEOUT } from '../../../shared/constants';

import EntryNotFound from '../../EntryNotFound/EntryNotFound';
import { Spinner } from 'react-shared';
import LambdaDetails from './LambdaDetails';

LambdaDetailsWrapper.propTypes = {
  lambdaName: PropTypes.string.isRequired,
};

export default function LambdaDetailsWrapper({ lambdaName }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const { data, error, loading, refetch } = useQuery(GET_LAMBDA, {
    variables: {
      name: lambdaName,
      namespace,
    },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading) {
    return <Spinner />;
  }
  if (data && !data.function) {
    setTimeout(() => {
      refetch();
    }, REFETCH_TIMEOUT);
    return <EntryNotFound entryType="Lambda" entryId={lambdaName} />;
  }
  if (data && data.function) {
    return <LambdaDetails lambda={data.function} />;
  }
}
