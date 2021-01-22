import React from 'react';
import LuigiClient from '@luigi-project/client';
import { Link } from 'fundamental-react';
import { useGetList, ResourcesListProps } from 'react-shared';
// import { ResourcesListProps } from '../../shared/components/ResourcesList/ResourcesList';
import { getComponentForList } from 'components/App/App';

const MySuperPredefinedList = ({
  resourceUrl,
  resourceType,
  namespace,
  hasDetailsView,
}) => {
  const { loading = true, error, data: resources } = useGetList(resourceUrl, {
    pollingInterval: 3000,
  });

  const ServiceList = null;
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
        And this is a list of services from kyma-system namespace rendered using
        a generic component
      </h1>
      {ServiceList}
    </>
  );
};
MySuperPredefinedList.propTypes = ResourcesListProps;

export const ReplicasetsList = DefaultRenderer => MySuperPredefinedList;
