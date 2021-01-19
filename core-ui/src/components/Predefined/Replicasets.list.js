import React, { useState } from 'react';

import { useGet } from 'react-shared';

const giphy = {
  baseURL: 'https://api.giphy.com/v1/gifs/',
  apiKey: '0UTRbFtkMxAplrohufYco5IY74U8hOes',
  tag: 'cat funny',
  type: 'random',
};

let giphyURL = encodeURI(
  giphy.baseURL + giphy.type + '?api_key=' + giphy.apiKey + '&tag=' + giphy.tag,
);

const SingleDeployment = ({ name }) => {
  const [gifUrl, setGifUrl] = useState();
  if (!gifUrl)
    fetch(giphyURL)
      .then(r => r.json())
      .then(r => setGifUrl(r.data.image_url));

  return (
    <div
      style={{
        maxWidth: '100%',
        border: '2px solid lime',
        textAlign: 'center',
        color: 'magenta',
        textShadow: '1px 1px 1px #555',
      }}
    >
      <img style={{ maxWidth: '100%', maxHeight: '16em' }} src={gifUrl}></img>{' '}
      <h3> {name}</h3>
    </div>
  );
};

export const DeploymentsList = ({ resourceUrl, resourceType, namespace }) => {
  const [resources, setResources] = React.useState([]);

  const { loading = true, error } = useGet(
    `/apis/apps/v1/namespaces/${namespace}/deployments`,
    setResources,
    namespace,
  );

  return (
    <>
      <h1 style={{ fontSize: '5em', color: 'tomato' }}>
        This is so custom I don't even have a header
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '4em',
        }}
      >
        {resources.map(r => (
          <SingleDeployment name={r.metadata.name} />
        ))}
      </div>
    </>
  );
};
