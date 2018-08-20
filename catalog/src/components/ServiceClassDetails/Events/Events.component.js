import React from 'react';
import PropTypes from 'prop-types';

import { Table } from '@kyma-project/react-components';

import { NameSpan, VersionSpan, Code } from './styled';

function Events({ title, description, topics, data }) {
  let processedData = [];
  if (topics && topics.length && data) {
    processedData = topics.map(topic => {
      const lastDotIndex = topic.lastIndexOf('.');
      return {
        name: topic.substring(0, lastDotIndex),
        version: topic.substring(lastDotIndex + 1, topic.length),
        description: data[topic].subscribe.summary,
        payload: data[topic].subscribe.payload,
      };
    });
  }

  const table = {
    title: 'Topics',
    columns: [
      {
        name: 'Name',
        size: 0.15,
        accesor: el => <NameSpan>{el.name}</NameSpan>,
      },
      {
        name: 'Version',
        size: 0.1,
        accesor: el => <VersionSpan>{el.version}</VersionSpan>,
      },
      {
        name: 'Description',
        size: 0.3,
        accesor: el => el.description,
      },
      {
        name: 'Payload',
        size: 0.45,
        accesor: el => <Code>{JSON.stringify(el.payload, undefined, 2)}</Code>,
      },
    ],
    data: processedData,
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>

      <Table
        title={table.title}
        columns={table.columns}
        data={table.data}
        notFoundMessage="Not Found Events"
      />
    </div>
  );
}

Events.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default Events;
