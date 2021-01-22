import React from 'react';
import LuigiClient from '@luigi-project/client';
import { Link } from 'fundamental-react';
import { useGetList } from 'react-shared';
import { ResourcesListProps } from 'shared/components/ResourcesList/ResourcesList';

const MySuperPredefinedList = ({
  resourceUrl,
  resourceType,
  namespace,
  hasDetailsView,
}) => {
  const { loading = true, error, data: resources } = useGetList(resourceUrl, {
    pollingInterval: 3000,
  });

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
    </>
  );
};
MySuperPredefinedList.propTypes = ResourcesListProps;

export const ReplicasetsList = DefaultRenderer => MySuperPredefinedList;
