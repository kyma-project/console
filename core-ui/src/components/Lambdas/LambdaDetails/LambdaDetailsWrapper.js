import React from 'react';
import LuigiClient from '@luigi-project/client';

import { useLambdaQuery } from 'components/Lambdas/gql/hooks/queries';

import EntryNotFound from '../../EntryNotFound/EntryNotFound';
import { Spinner } from 'react-shared';

import LambdaDetails from './LambdaDetails';

import './LambdaDetails.scss';

export default function LambdaDetailsWrapper({ lambdaName }) {
  const { lambda, error, loading } = useLambdaQuery({
    name: lambdaName,
    namespace: LuigiClient.getEventData().environmentId,
  });

  let content = null;
  if (loading) {
    content = <Spinner />;
  } else if (error) {
    content = <span>Error! {error.message}</span>;
  } else if (!lambda) {
    content = <EntryNotFound entryType="Lambda" entryId={lambdaName} />;
  } else {
    const backendModules = LuigiClient.getEventData().backendModules;
     if(lambda.runtime==='nodejs10'){
       LuigiClient
       .uxManager()
       .showAlert({
        text: "This Function runtime is no longer supported. Use kubectl to change runtime to nodejs12 or newer.",
        type: 'warning',
        closeAfter: 10000
       });
     }
    content = <LambdaDetails lambda={lambda} backendModules={backendModules} />;
  }

  return <div className="lambda-details">{content}</div>;
}
