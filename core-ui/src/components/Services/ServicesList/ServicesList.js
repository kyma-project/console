import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import Moment from 'react-moment';
import jsyaml from 'js-yaml';
import { Link } from 'fundamental-react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GenericList,
  Labels,
  useYamlEditor,
  useNotification,
  EMPTY_TEXT_PLACEHOLDER,
  easyHandleDelete,
} from 'react-shared';

import { GET_SERVICES } from 'gql/queries';
import { UPDATE_SERVICE, DELETE_SERVICE } from 'gql/mutations';

ServicesList.propTypes = { namespace: PropTypes.string.isRequired };

export default function ServicesList({ namespace }) {
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const [updateServiceMutation] = useMutation(UPDATE_SERVICE);
  const [deleteServiceMutation] = useMutation(DELETE_SERVICE, {
    refetchQueries: () => [
      {
        query: GET_SERVICES,
        variables: { namespace },
      },
    ],
  });

  const navigateToServiceDetails = service =>
    LuigiClient.linkManager().navigate(`details/${service.name}`);

  const { data, error, loading } = useQuery(GET_SERVICES, {
    variables: { namespace },
  });

  const deleteService = service => {
    easyHandleDelete(
      'Service',
      service.name,
      deleteServiceMutation,
      { variables: { name: service.name, namespace } },
      'deleteService',
      notification,
    );
  };

  const updateService = async (service, updatedSpec) => {
    try {
      await updateServiceMutation({
        variables: {
          namespace,
          name: service.name,
          service: updatedSpec,
        },
        refetchQueries: () => [
          {
            query: GET_SERVICES,
            variables: { namespace },
          },
        ],
      });
      notification.notifySuccess({
        content: 'Service updated',
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Cannot update service: ${e.message}.`,
      });
      throw e;
    }
  };

  const actions = [
    {
      name: 'Delete',
      handler: deleteService,
    },
    {
      name: 'Details',
      handler: navigateToServiceDetails,
    },
    {
      name: 'Edit',
      handler: service =>
        setEditedSpec(
          service.json,
          async spec => await updateService(service, jsyaml.safeLoad(spec)),
        ),
    },
  ];

  const listOfEndpoints = entry => {
    if (entry.ports && entry.ports.length) {
      return entry.ports.map(port => {
        const portValue = `${entry.name}.${namespace}: ${port.port} ${port.serviceProtocol}`;
        return <li key={portValue}>{portValue}</li>;
      });
    } else {
      return <span> {EMPTY_TEXT_PLACEHOLDER} </span>;
    }
  };

  const headerRenderer = () => [
    'Name',
    'Cluster IP',
    'Internal endpoints',
    'Age',
    'Labels',
  ];

  const rowRenderer = entry => [
    <Link onClick={() => navigateToServiceDetails(entry)}>{entry.name}</Link>,
    <span>{entry.clusterIP || EMPTY_TEXT_PLACEHOLDER}</span>,
    <ul>{listOfEndpoints(entry)}</ul>,
    <Moment unix fromNow>
      {entry.creationTimestamp}
    </Moment>,
    <Labels labels={entry.labels} />,
  ];

  return (
    <GenericList
      actions={actions}
      entries={data?.services || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      server={error}
      loading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
      actionsStandaloneItems={3}
    />
  );
}
