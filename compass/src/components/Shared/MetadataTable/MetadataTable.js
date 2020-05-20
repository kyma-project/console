import React from 'react';
import PropTypes from 'prop-types';

import { GenericList, CopiableLink } from 'react-shared';

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

MetadataTable.propTypes = {
  labels: PropTypes.object,
  ownerType: PropTypes.string.isRequired,
  ignoredLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
};

MetadataTable.defaultProps = {
  ignoredLabels: ['scenarios'],
};

export default function MetadataTable({ labels, ownerType, ignoredLabels }) {
  const entries = labels
    ? Object.entries(labels)
        .filter(([key]) => !ignoredLabels.includes(key))
        .map(([key, value]) => ({
          key,
          value:
            typeof value === 'object' ? JSON.stringify(value, null, 2) : value,
        }))
    : [];

  const headerRenderer = () => ['Name', 'Value'];
  const rowRenderer = ({ key, value }) => [
    key,
    isUrl(value) ? <CopiableLink url={value} /> : value,
  ];

  return (
    <GenericList
      title="Metadata"
      notFoundMessage={`This ${ownerType} doesn't have any metadata.`}
      entries={entries}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['key', 'value']}
    />
  );
}
