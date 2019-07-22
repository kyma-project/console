import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';

ApplicationDetailsEventApis.propTypes = {
  eventApis: PropTypes.object.isRequired,
};

export default function ApplicationDetailsEventApis(props) {
  const eventApiList = props.eventApis.data;

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <span className="link">
      {' '}
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        console.log('todo #1009');
      },
    },
  ];
  return (
    <Panel className="fd-has-margin-top-medium">
      <Panel.Body>
        <Panel.Header>
          <Panel.Head title="Event APIs" />
        </Panel.Header>
        <GenericList
          title="Event APIs"
          description="List of Event APIs"
          actions={actions}
          entries={eventApiList}
          headerRenderer={headerRenderer}
          rowRenderer={rowRenderer}
        />
      </Panel.Body>
    </Panel>
  );
}
