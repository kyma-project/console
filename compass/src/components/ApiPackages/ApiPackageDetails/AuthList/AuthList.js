import React from 'react';
import PropTypes from 'prop-types';

import { InlineHelp } from 'fundamental-react';
import { GenericList } from 'react-shared';

AuthList.propTypes = {
  auths: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function AuthList({ auths }) {
  auths = [
    {
      status: {
        reason: 'Nie interesuj sie',
        condition: 'PENDING',
      },
    },
    {
      status: {
        reason: null,
        condition: 'SUCCEEDED',
      },
    },
    {
      status: {
        reason: 'Bo tak',
        condition: 'FAILED',
      },
    },
    {
      status: {
        reason: '',
        condition: 'UNUSED',
      },
    },
  ];

  const headerRenderer = () => ['Name', 'Status'];

  const rowRenderer = auth => [
    '...',
    <span>
      {auth.status.condition}
      {auth.status.reason && (
        <InlineHelp
          className="fd-has-margin-left-small"
          placement="bottom-center"
          text={auth.status.reason}
        />
      )}
    </span>,
  ];

  return (
    <GenericList
      title="Auths"
      notFoundMessage="There are no Auths present for this API Package"
      entries={auths}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['TODO']}
    />
  );
}
