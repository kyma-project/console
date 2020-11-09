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
  useUpdate,
} from 'react-shared';

import { GET_SERVICES } from 'gql/queries';
import { UPDATE_SERVICE } from 'gql/mutations';

PodList.propTypes = { namespace: PropTypes.string.isRequired };

export default function PodList({ namespace }) {
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const updatePodMutation = useUpdate('pods');
  const [pods, setPods] = React.useState([]);
  const { loading = true, error } = useGet('pods', setPods, namespace);

  const handleSaveClick = podData => async newYAML => {
    let json;

    try {
      json = jsyaml.safeLoad(newYAML);
      if (json.metadata?.resourceVersion) delete json.metadata.resourceVersion; // TODO: do this on the backend side
      await updatePodMutation({
        name: podData.metadata.name,
        namespace,
        json: newYAML,
      });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        content: 'Failed to update the LimitRange',
      });
      throw e;
    }
  };

  const actions = [
    {
      name: 'Edit',
      handler: pod => setEditedSpec(pod.json, handleSaveClick(pod)),
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
