import React from 'react';
import PropTypes from 'prop-types';

import AuthDetailsModal from '../AuthDetailsModal/AuthDetailsModal';
import { Badge } from 'fundamental-react';
import { GenericList, StatusBadge } from 'react-shared';

AuthList.propTypes = {
  auths: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

const AuthStatus = ({ timestamp, message, reason, condition }) => {
  if (condition === 'PENDING' && !message) {
    message = 'No default auth provided.';
  }
  return (
    <StatusBadge
      tooltipContent={`[${timestamp}] ${reason}: ${message}`}
      autoResolveType
    >
      {condition}
    </StatusBadge>
  );
};

const AuthContext = ({ context }) => {
  const valuesToDisplay = 2;
  try {
    const parsedContext = JSON.parse(context || '{}');
    const keys = Object.keys(parsedContext).slice(0, valuesToDisplay);
    return keys.map(key => (
      <Badge
        key={key}
        className="fd-has-margin-right-tiny"
      >{`${key}: ${parsedContext[key]}`}</Badge>
    ));
  } catch (e) {
    console.warn(e);
    return '';
  }
};

export default function AuthList({ auths }) {
  const headerRenderer = () => ['Context', 'Status', ''];

  const rowRenderer = auth => [
    <AuthContext context={auth.context} />,
    <AuthStatus {...auth.status} />,
    <AuthDetailsModal auth={auth} />,
  ];

  return (
    <GenericList
      title="Auths"
      notFoundMessage="There are no Auths present for this Package"
      entries={auths}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      showSearchField={false}
    />
  );
}
