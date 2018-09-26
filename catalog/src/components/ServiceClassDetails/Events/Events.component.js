import React from 'react';
import PropTypes from 'prop-types';

import { Table } from '@kyma-project/react-components';

import { NameSpan, VersionSpan, Code } from './styled';

function Events({ asyncApiSpec }) {
  const title = asyncApiSpec.info.title,
    description = asyncApiSpec.info.description,
    topics = Object.keys(asyncApiSpec.topics),
    data = asyncApiSpec.topics;

  let processedData = [];
  if (topics && topics.length && data) {
    processedData = topics.map(topic => {
      const lastDotIndex = topic.lastIndexOf('.');
      return {
        name: lastDotIndex !== -1 ? topic.substring(0, lastDotIndex) : topic,
        version:
          lastDotIndex !== -1
            ? topic.substring(lastDotIndex + 1, topic.length)
            : '-',
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
        accesor: el => (el.description ? el.description : '-'),
      },
      {
        name: 'Payload',
        size: 0.45,
        accesor: el =>
          el.payload && Object.keys(el.payload).length ? (
            <Code>{JSON.stringify(el.payload, undefined, 2)}</Code>
          ) : (
            '-'
          ),
      },
    ],
    data: processedData,
  };

  return (
    <div>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}

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
  asyncApiSpec: PropTypes.object.isRequired,
};

export default Events;
