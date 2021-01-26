import React from 'react';

export const ReplicasetDetails = GenericHeader => ({
  resourceUrl,
  resourceType,
  resourceName,
  namespace,
}) => {
  return (
    <>
      <GenericHeader />
      <img
        alt="yes"
        src="https://media.giphy.com/media/CqVNwrLt9KEDK/source.gif"
      ></img>
      <h3
        style={{
          fontSize: '5em',
          color: 'lime',
          transform: 'scaley(4)',
          textShadow: '1px 1px 2px #555',
        }}
      >
        replicaset details predefined view
      </h3>
    </>
  );
};
