import React from "react";
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';

ApplicationDetailsApis.propTypes = {
  apis: PropTypes.object.isRequired,
};

export default function ApplicationDetailsApis(props) {
  const apisList = props.apis.data;

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <span className="link">
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
    api.targetURL,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        console.log('todo #1009j');
        // LuigiClient.uxManager()
        //   .showConfirmationModal({
        //     header: 'Remove application',
        //     body: `Are you sure you want to delete ${entry.name}?`,
        //     buttonConfirm: 'No',
        //     buttonDismiss: 'Also no',
        //   })
        //   .catch(() => {})
        //   .finally(() => {
        //     console.warn('As you wish, nothing will be removed');
        //   });
      },
    },
  ];

  return (
    <Panel className="fd-has-margin-top-small">
      <GenericList
        title="APIs"
        description="List of APIs"
        actions={actions}
        entries={apisList}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
