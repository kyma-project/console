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
} from 'react-shared';

import { GET_SERVICES } from 'gql/queries';
import { UPDATE_SERVICE } from 'gql/mutations';

PodList.propTypes = { namespace: PropTypes.string.isRequired };

export default function PodList({ namespace }) {
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();

  // const updateService = async (service, updatedSpec) => {
  //   try {
  //     await updateServiceMutation({
  //       variables: {
  //         namespace,
  //         name: service.name,
  //         service: updatedSpec,
  //       },
  //       refetchQueries: () => [
  //         {
  //           query: GET_SERVICES,
  //           variables: { namespace },
  //         },
  //       ],
  //     });
  //     notification.notifySuccess({
  //       content: 'Service updated successfully',
  //     });
  //   } catch (e) {
  //     console.warn(e);
  //     notification.notifyError({
  //       content: `Cannot update service: ${e.message}.`,
  //     });
  //     throw e;
  //   }
  // };

  const actions = [
    {
      name: 'Edit',
      handler: service =>
        setEditedSpec(
          service.json,
          _ => {},
          // async spec => await updateService(service, jsyaml.safeLoad(spec)),
        ),
    },
  ];

  const headerRenderer = () => [
    'Name',
    'Cluster IP',
    'Internal endpoints',
    'Age',
    'Labels',
  ];

  const rowRenderer = entry => [<Link>{entry.name}</Link>];

  return (
    <GenericList
      actions={actions}
      entries={[]}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      // server={error}
      // loading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
