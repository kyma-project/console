import React from 'react';
import LuigiClient from '@luigi-project/client';

import { useLambdaQuery } from 'components/Lambdas/gql/hooks/queries';

import EntryNotFound from '../../EntryNotFound/EntryNotFound';
import { Spinner, useNotification } from 'react-shared';

import LambdaDetails from './LambdaDetails';

import './LambdaDetails.scss';

export default function LambdaDetailsWrapper({ lambdaName }) {
  const { lambda, error, loading } = useLambdaQuery({
    name: lambdaName,
    namespace: LuigiClient.getEventData().environmentId,
  });
  const notificationManager = useNotification();

  let content = null;
  if (loading) {
    content = <Spinner />;
  } else if (error) {
    content = <span>Error! {error.message}</span>;
  } else if (!lambda) {
    content = <EntryNotFound entryType="Lambda" entryId={lambdaName} />;
  } else {
    const backendModules = LuigiClient.getEventData().backendModules;
    content = <LambdaDetails lambda={lambda} backendModules={backendModules} />;
  }

  React.useEffect(() => {
    if (lambda?.runtime === 'nodejs10') {
      notificationManager.notifyWarning({
        content:
          'This Function runtime is no longer supported. Use kubectl to change runtime to nodejs12 or newer.',
        title: 'Nodejs10 is no longer supported',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lambda]);

  return <div className="lambda-details">{content}</div>;
}
