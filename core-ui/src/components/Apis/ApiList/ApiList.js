import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList, useNotification, easyHandleDelete } from 'react-shared';
import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import { CompassGqlContext } from 'index';
import { DELETE_API_DEFINITION } from 'gql/mutations';
import { useMutation } from '@apollo/react-hooks';
import CreateApiForm from '../CreateApiForm/CreateApiForm';

ApiList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apis: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function ApiList({ applicationId, apis }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const notificationManager = useNotification();

  const [deleteApiDefinition] = useMutation(DELETE_API_DEFINITION, {
    client: compassGqlClient,
  });

  function navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`api/${entry.id}/edit`);
  }

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <span
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`api/${api.id}`)}
    >
      {api.name}
    </span>,
    api.description,
    api.targetURL,
  ];

  const actions = [
    {
      name: 'Edit',
      handler: navigateToDetails,
    },
    {
      name: 'Delete',
      handler: api =>
        easyHandleDelete(
          'API',
          api.name,
          deleteApiDefinition,
          {
            variables: { id: api.id },
          },
          'deleteAPIDefinition',
          notificationManager,
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add API Definition"
      button={{ glyph: 'add', text: '' }}
      renderForm={props => (
        <CreateApiForm applicationId={applicationId} {...props} />
      )}
    />
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="API Definitions"
      notFoundMessage="There are no API Definitions available for this Application"
      actions={actions}
      entries={apis}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description', 'targetURL']}
    />
  );
}
