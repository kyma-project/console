import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import './ApiList.scss';

import CreateApiForm from 'components/Apis/CreateApiForm/CreateApiForm';
import {
  GenericList,
  handleDelete,
  ModalWithForm,
  useNotification,
} from 'react-shared';
import { Link } from 'fundamental-react';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_API_DEFINITION } from 'gql/mutations';
import { GET_API_PACKAGE } from 'gql/queries';
import { CompassGqlContext } from 'index';

ApiList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
  apiDefinitions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function ApiList({
  applicationId,
  apiPackageId,
  apiDefinitions,
}) {
  const notificationManager = useNotification();
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [deleteApiDefinition] = useMutation(DELETE_API_DEFINITION, {
    client: compassGqlClient,
    refetchQueries: () => [
      { query: GET_API_PACKAGE, variables: { applicationId, apiPackageId } },
    ],
  });

  function navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`api/${entry.id}/edit`);
  }

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <Link
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`api/${api.id}`)}
    >
      {api.name}
    </Link>,
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
      handler: entry =>
        handleDelete(
          'API',
          entry.id,
          entry.name,
          () => deleteApiDefinition({ variables: { id: entry.id } }),
          () =>
            notificationManager.notifySuccess({
              content: `Deleted API "${entry.name}".`,
            }),
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add API Definition"
      button={{ glyph: 'add', label: 'Add API Definition' }}
      renderForm={props => (
        <CreateApiForm
          applicationId={applicationId}
          apiPackageId={apiPackageId}
          {...props}
        />
      )}
    />
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="API Definitions"
      notFoundMessage="There are no API Definitions available for this Package"
      actions={actions}
      entries={apiDefinitions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'description', 'targetURL']}
    />
  );
}
