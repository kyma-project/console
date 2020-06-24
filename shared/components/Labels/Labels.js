import React from 'react';
import { Token } from 'fundamental-react/Token';
import { EMPTY_TEXT_PLACEHOLDER } from '../../constants/constants';

export const Labels = labels => {
  labels = labels.labels;
  if (!labels || Object.keys(labels).length === 0) {
    return <span>{EMPTY_TEXT_PLACEHOLDER}</span>;
  }
  const separatedLabels = [];
  /* eslint-disable no-unused-vars */
  for (const key in labels) {
    separatedLabels.push(`${key}=${labels[key]}`);
  }

  /* eslint-enable no-unused-vars */
  return separatedLabels.map((label, id) => (
    <Token
      key={id}
      style={{ marginTop: '4px', marginBottom: '4px' }}
      className="y-fd-token y-fd-token--no-button y-fd-token--gap"
    >
      {label}
    </Token>
  ));
};
