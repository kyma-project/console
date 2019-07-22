import React from "react";
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import LuigiClient from '@kyma-project/luigi-client';

ApplicationDetailsEventApis.propTypes = {
  eventApis: PropTypes.object.isRequired,
};

export default function ApplicationDetailsEventApis(props) {
  const eventApiList = props.eventApis.data;

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <span className="link">
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: 'Remove Event API',
            body: `Are you sure you want to delete ${entry.name}?`,
            buttonConfirm: 'Yes',
            buttonDismiss: 'No',
          })
          .then(() => {})
          .catch(() => {});
      }
    },
  ];

  return (
    <Panel className="fd-has-margin-top-medium">
      <GenericList
        title="Event APIs"
        description="List of Event APIs"
        actions={actions}
        entries={eventApiList}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
