import React from 'react';
import LuigiClient from '@luigi-project/client';
import { Link } from 'fundamental-react';
import { useGetList, ResourcesListProps, getComponentFor } from 'react-shared';

import {
  getComponentForList,
  getComponentForDetails,
} from 'components/App/App';
const MySuperPredefinedList = ({
  resourceUrl,
  resourceType,
  namespace,
  hasDetailsView,
}) => {
  const { /*loading = true, error, */ data: resources } = useGetList(
    () => true,
  )(resourceUrl, {
    pollingInterval: 3000,
  });

  const params = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${namespace}/pods`,
    resourceType: 'pods',
    namespace: namespace,
    isCompact: true,
  };
  const rendererName = 'podsList';
  const PodsList = getComponentForDetails(rendererName, params);
  // const ServiceList = getComponentFor('ServicesList', {
  //   resourceUrl: `/api/v1/namespaces/default/services`,
  //   resourceType: 'services',
  //   namespace: 'default',
  //   isCompact: true,
  // });
  if (!Array.isArray(resources)) return 'Loading';

  return (
    <>
      <h1 style={{ fontSize: '5em', color: 'tomato' }}>
        This is predefined but doesn't use generic renderer
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '4em',
        }}
      >
        {resources.map(r =>
          hasDetailsView ? (
            <Link
              onClick={_ =>
                LuigiClient.linkManager()
                  .fromClosestContext()
                  .navigate('/details/' + r.metadata.name)
              }
              key={r.metadata.resourceVersion}
            >
              {r.metadata.name}
            </Link>
          ) : (
            <span key={r.metadata.resourceVersion}>{r.metadata.name}</span>
          ),
        )}
      </div>
      <hr style={{ margin: '5em 0', border: '0.5em solid crimson' }} />
      <h1>
        And this is a list of services from default namespace rendered using a
        generic component
      </h1>
      {PodsList}
    </>
  );
};
MySuperPredefinedList.propTypes = ResourcesListProps;

export const ReplicasetsList = DefaultRenderer => MySuperPredefinedList;
