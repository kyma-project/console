import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { GenericList, useNotification, handleDelete } from 'react-shared';

import { DELETE_API_PACKAGE } from 'gql/mutations';
import { useMutation } from '@apollo/react-hooks';
import { GET_APPLICATION_COMPASS } from 'gql/queries';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import CreateApiPackageForm from '../../ApiPackages/CreateApiPackageForm/CreateApiPackageForm';
import { Counter } from 'fundamental-react';
import { CompassGqlContext } from 'index';

ApplicationApiPackages.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackages: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function ApplicationApiPackages({ applicationId, apiPackages }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const notificationManager = useNotification();

  const [deleteApiPackage] = useMutation(DELETE_API_PACKAGE, {
    client: compassGqlClient,
    refetchQueries: () => [
      { query: GET_APPLICATION_COMPASS, variables: { id: applicationId } },
    ],
  });

  function navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`apiPackage/${entry.id}`);
  }

  const headerRenderer = () => [
    'Name',
    'Description',
    'API Definitions',
    'Event Definitions',
  ];

  const rowRenderer = apiPackage => [
    <span className="link" onClick={() => navigateToDetails(apiPackage)}>
      {apiPackage.name}
    </span>,
    apiPackage.description,
    <Counter>{apiPackage.apiDefinitions.totalCount}</Counter>,
    <Counter>{apiPackage.eventDefinitions.totalCount}</Counter>,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry =>
        handleDelete(
          'Package',
          entry.id,
          entry.name,
          id => deleteApiPackage({ variables: { id } }),
          notificationManager.notifySuccess({
            content: `${entry.name} deleted`,
          }),
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Create Package"
      button={{ glyph: 'add', text: '' }}
      renderForm={props => (
        <CreateApiPackageForm applicationId={applicationId} {...props} />
      )}
    />
  );

  return (
    <GenericList
      title="Packages"
      extraHeaderContent={extraHeaderContent}
      notFoundMessage="There are no Packages defined for this Application"
      actions={actions}
      entries={apiPackages}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description']}
    />
  );
}
