import React from 'react';
import PropTypes from 'prop-types';

import AuthDetailsModal from '../AuthDetailsModal/AuthDetailsModal';
import { Badge } from 'fundamental-react';
import { GenericList, Tooltip } from 'react-shared';

AuthList.propTypes = {
  auths: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

const getBadgeForCondition = condition => {
  switch (condition.toUpperCase()) {
    case 'SUCCEEDED':
      return 'success';
    case 'FAILED':
      return 'error';
    default:
      return 'warning';
  }
};

const AuthStatus = ({ timestamp, message, reason, condition }) => (
  <Tooltip position="top" title={`[${timestamp}] ${reason} ${message}`}>
    <Badge type={getBadgeForCondition(condition)}>{condition}</Badge>
  </Tooltip>
);

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
  auths = [
    {
      context: JSON.stringify({ a: 'b', c: 'd' }),
      inputParams: JSON.stringify({ a: 'b' }),
      status: {
        timestamp: '2020-03-09T09:15:29+00:00',
        message: 'Nie interesuj sie',
        reason: 'PendingDeletion',
        condition: 'PENDING',
      },
    },
    {
      context: JSON.stringify({ a: 'b', c: 'd' }),
      inputParams: JSON.stringify({ a: 'b' }),
      status: {
        timestamp: '2010-11-09T09:15:29+11:00',
        reason: null,
        message: 'msg',
        condition: 'SUCCEEDED',
      },
    },
    {
      context: JSON.stringify({ a: 'b', c: 'd' }),
      inputParams: JSON.stringify({ a: 'b' }),
      status: {
        timestamp: '2020-03-09T09:15:29+00:00',
        message: 'Witam w ten piękny poranek',
        reason: 'Bo tak',
        condition: 'FAILED',
      },
    },
    {
      context: JSON.stringify({ a: 'b', c: 'd' }),
      inputParams: JSON.stringify({ a: 'b' }),
      status: {
        timestamp: '2020-03-09T09:15:29+00:00',
        message: 'msg',
        reason: '',
        condition: 'UNUSED',
      },
    },
  ];

  const headerRenderer = () => ['Context', 'Status', ''];

  const rowRenderer = auth => [
    <AuthContext context={auth.context} />,
    <AuthStatus {...auth.status} />,
    <AuthDetailsModal auth={auth} />,
  ];

  return (
    <GenericList
      title="Auths"
      notFoundMessage="There are no Auths present for this API Package"
      entries={auths}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      showSearchField={false}
    />
  );
}
