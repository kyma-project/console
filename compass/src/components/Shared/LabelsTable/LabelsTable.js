import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'fundamental-react';
import { GenericList } from 'react-shared';

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

const Link = ({ target }) => (
  <a href={target} target="_blank" rel="noopener noreferrer">
    {target}
    <Icon glyph="inspect" size="s" className="fd-has-margin-left-tiny" />
  </a>
);

LabelsTable.propTypes = {
  labels: PropTypes.object,
  ownerType: PropTypes.string.isRequired,
  ignoredLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
};

LabelsTable.defaultProps = {
  ignoredLabels: ['scenarios'],
};

export default function LabelsTable({ labels, ownerType, ignoredLabels }) {
  const entries = labels
    ? Object.entries(labels)
        .filter(([key]) => !ignoredLabels.includes(key))
        .map(([key, value]) => ({
          key,
          value,
        }))
    : [];

  const headerRenderer = () => ['Name', 'Value'];
  const rowRenderer = ({ key, value }) => [
    key,
    isUrl(value) ? <Link target={value} /> : value,
  ];

  return (
    <GenericList
      title="Labels"
      notFoundMessage={`This ${ownerType} doesn't have any labels.`}
      entries={entries}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['Name', 'Value']}
    />
  );
}
