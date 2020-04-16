import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { useLambdaQuery } from 'components/Lambdas/gql/hooks/queries';

import EntryNotFound from '../../EntryNotFound/EntryNotFound';
import { Spinner } from 'react-shared';

import LambdaDetails from './LambdaDetails';

export default function LambdaDetailsWrapper({ lambdaName }) {
  const { lambda, error, loading } = useLambdaQuery({
    name: lambdaName,
    namespace: LuigiClient.getEventData().environmentId,
  });

  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading) {
    return <Spinner />;
  }
  if (!lambda) {
    return <EntryNotFound entryType="Lambda" entryId={lambdaName} />;
  }

  return <LambdaDetails lambda={lambda} />;
}
