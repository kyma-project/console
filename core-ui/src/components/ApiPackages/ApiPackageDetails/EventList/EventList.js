import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import './EventList.scss';

import CreateEventForm from 'components/Apis/CreateEventForm/CreateEventForm';
import {
  GenericList,
  handleDelete,
  ModalWithForm,
  useNotification,
} from 'react-shared';
import { Link } from 'fundamental-react';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_EVENT_DEFINITION } from 'gql/mutations';
import { GET_API_PACKAGE } from 'gql/queries';
import { CompassGqlContext } from 'index';

EventList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  apiPackageId: PropTypes.string.isRequired,
  eventDefinitions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function EventList({
  applicationId,
  apiPackageId,
  eventDefinitions,
}) {
  const notificationManager = useNotification();
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [deleteEventDefinition] = useMutation(DELETE_EVENT_DEFINITION, {
    client: compassGqlClient,
    refetchQueries: () => [
      { query: GET_API_PACKAGE, variables: { applicationId, apiPackageId } },
    ],
  });

  function navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`eventApi/${entry.id}/edit`);
  }

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <Link
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`eventApi/${api.id}`)}
    >
      {api.name}
    </Link>,

    api.description,
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
          () => deleteEventDefinition({ variables: { id: entry.id } }),
          () =>
            notificationManager.notifySuccess({
              content: `Deleted Event "${entry.name}".`,
            }),
        ),
    },
  ];

  const extraHeaderContent = (
    <ModalWithForm
      title="Add Event Definition"
      button={{ glyph: 'add', label: 'Add Event Definition' }}
      renderForm={props => (
        <CreateEventForm
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
      title="Event Definitions"
      notFoundMessage="There are no Event Definition available for this Package"
      actions={actions}
      entries={eventDefinitions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
