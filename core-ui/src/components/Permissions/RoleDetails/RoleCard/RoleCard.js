import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from 'fundamental-react';
import './RoleCard.scss';

const arrayOfString = PropTypes.arrayOf(PropTypes.string.isRequired).isRequired;
RoleCard.propTypes = {
  apiGroups: arrayOfString,
  resources: arrayOfString,
  verbs: arrayOfString,
};

export default function RoleCard({ apiGroups, resources, verbs }) {
  const Segment = ({ name, arr }) => (
    <>
      <div className="fd-has-color-text-4">{name}</div>
      <div>{arr.join(', ')}</div>
    </>
  );

  // in case apiGroup === '', replace it with a default
  const coreGroup = '/api/v1';
  apiGroups = apiGroups.map(aG => aG || coreGroup);

  return (
    <Panel>
      <Panel.Header>
        <Panel.Head title="Rule" />
      </Panel.Header>
      <Panel.Body className="rule-info">
        <Segment name="API Groups" arr={apiGroups} />
        <Segment name="Verbs" arr={verbs} />
        <Segment name="Resources" arr={resources} />
      </Panel.Body>
    </Panel>
  );
}
