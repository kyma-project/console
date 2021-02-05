import React from 'react';
import { getComponentForList } from './../App/App';
import { useGetList } from 'react-shared';

export const DeploymentsDetails = DefaultRenderer => ({ ...otherParams }) => {
  // const { data: replicas } = useGetList(rs =>
  //   !!rs.metadata.ownerReferences.find(
  //     ref =>
  //       ref.kind === 'Deployment' && ref.name === otherParams.resourceName))(
  //         otherParams.resourceUrl,
  //   {
  //     pollingInterval: 3000,
  //   },
  // );

  // const [replica, setReplica] = React.useStatet

  // React.useEffect(() => {

  // })

  // we can't use ?labelSelector=app%3D${otherParams.resourceName}, as some
  // pods (like function ones) don't have this label
  const podListParams = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.namespace}/pods`,
    resourceType: 'pods',
    namespace: otherParams.namespace,
    isCompact: true,
    showTitle: true,
    filter: e => {
      console.log(e);
      return true;
    },
  };

  const PodsList = getComponentForList('podsList', podListParams);

  return <DefaultRenderer {...otherParams}>{PodsList}</DefaultRenderer>;
};
