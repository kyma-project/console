import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import Logs from './Logs';

import { QueryTransformServiceContext } from '../services/queryTransformService';
import { HttpServiceContext } from '../services/httpService';
import { PodSubscriptionServiceContext } from '../services/podSubscriptionService';

export default function LogsContainer() {
  const httpService = React.useContext(HttpServiceContext);
  const queryTransformService = React.useContext(QueryTransformServiceContext);
  const podsSubscriptionService = React.useContext(
    PodSubscriptionServiceContext,
  );

  function todo_is_lambda() {
    var params = LuigiClient.getNodeParams();
    return !!params.function;
  }

  function getLambdaData() {
    const params = LuigiClient.getNodeParams();
    const labels = [
      `function="${params.function}"`,
      `namespace="${params.namespace}"`,
      `container_name="${params.container_name}"`,
    ];
    const lambdaName = params.container_name;
    return { labels, lambdaName };
  }

  const isLambda = todo_is_lambda();

  if (isLambda) {
    const { labels, lambdaName } = getLambdaData();

    return (
      <Logs
        httpService={httpService}
        queryTransformService={queryTransformService}
        podsSubscriptionService={podsSubscriptionService}
        isLambda={true}
        readonlyLabels={labels}
        lambdaName={lambdaName}
      />
    );
  } else {
    return (
      <Logs
        httpService={httpService}
        queryTransformService={queryTransformService}
        podsSubscriptionService={podsSubscriptionService}
      />
    );
  }
}
