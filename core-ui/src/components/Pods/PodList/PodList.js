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
  useGet,
} from 'react-shared';

import { GET_SERVICES } from 'gql/queries';
import { UPDATE_SERVICE } from 'gql/mutations';

PodList.propTypes = { namespace: PropTypes.string.isRequired };

export default function PodList({ namespace }) {
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();

  const [pods, setPods] = React.useState([]);
  const { loading = true, error } = useGet('pods', setPods, namespace);

  const actions = [
    {
      name: 'Edit',
      handler: pod =>
        setEditedSpec(
          pod.json,
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

  const rowRenderer = entry => [<Link>{entry.metadata.name}</Link>];
  console.log(pods.items);
  return (
    <GenericList
      actions={actions}
      entries={pods.items || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverDataLoading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
