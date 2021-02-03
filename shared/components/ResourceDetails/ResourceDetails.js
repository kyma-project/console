import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import jsyaml from 'js-yaml';
import { Button } from 'fundamental-react';

import { createPatch } from 'rfc6902';
import {
  PageHeader,
  HeaderLabelsEditor,
  YamlEditorProvider,
  useGet,
  useUpdate,
  useDelete,
  useYamlEditor,
  useNotification,
} from '../..';
import CustomPropTypes from '../../typechecking/CustomPropTypes';

ResourceDetails.propTypes = {
  customColumns: CustomPropTypes.customColumnsType,
  customTables: PropTypes.array,
  resourceUrl: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  namespace: PropTypes.string,
  // isCompact: PropTypes.bool, // TODO: decide if needed
};

ResourceDetails.defaultProps = {
  customColumns: [],
  customTables: [],
};

export function ResourceDetails(props) {
  if (!props.resourceUrl) {
    return <></>; // wait for the context update
  }

  const {
    loading = true,
    error,
    data: resource,
    silentRefetch,
  } = useGet(props.resourceUrl, { pollingInterval: 3000 });

  const updateResourceMutation = useUpdate(props.resourceUrl);
  const deleteResourceMutation = useDelete(props.resourceUrl);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;
  console.log('resource', resource, 'resourceUrl', props.resourceUrl);

  console.log('list resourceUrl', props.resourceUrl);
  return (
    <YamlEditorProvider>
      {resource && (
        <Resource
          deleteResourceMutation={deleteResourceMutation}
          updateResourceMutation={updateResourceMutation}
          silentRefetch={silentRefetch}
          resource={resource}
          {...props}
        />
      )}
    </YamlEditorProvider>
  );
}

function Resource({
  silentRefetch,
  resource,
  customTables,
  customColumns,
  resourceUrl,
  resourceType,
  updateResourceMutation,
  namespace,
  resourceName,
}) {
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();

  const [isEditMode, setEditMode] = React.useState(false);
  console.log('Resource customTables', customTables);

  const breadcrumbs = [
    {
      name: resourceType,
      path: '/',
      fromAbsolutePath: resourceType === 'namespaces',
    },
    { name: '' },
  ];
  const actions = isEditMode ? (
    <>
      <Button onClick={() => {}} option="emphasized">
        Save
      </Button>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
    </>
  ) : (
    <>
      <Button onClick={() => setEditMode(true)} option="emphasized">
        Edit
      </Button>

      <Button onClick={() => openYaml(resource)} option="emphasized">
        Edit YAML
      </Button>
      <Button onClick={() => deleteClient()} option="light" type="negative">
        Delete
      </Button>
    </>
  );
  const openYaml = resource => {
    const { status, ...otherResourceData } = resource; // remove 'status' property because you can't edit it anyway; TODO: decide if it's good
    setEditedSpec(otherResourceData, handleSaveClick(otherResourceData));
  };
  const handleSaveClick = resourceData => async newYAML => {
    try {
      const diff = createPatch(resourceData, jsyaml.safeLoad(newYAML));

      await updateResourceMutation(resourceUrl, diff);
      silentRefetch();
      notification.notifySuccess({ title: 'Succesfully updated Resource' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to update the Resource',
        content: e.message,
      });
      throw e;
    }
  };

  return (
    <>
      <PageHeader
        title={resource.metadata.name}
        actions={actions}
        breadcrumbItems={breadcrumbs}
      >
        <HeaderLabelsEditor
          labels={resource.metadata.labels || {}}
          onApply={() => {}}
          columnSpan="1 / 3"
        />
        <PageHeader.Column title="Age">
          <Moment utc fromNow>
            {resource.metadata.creationTimestamp}
          </Moment>
        </PageHeader.Column>
        {customColumns.map(col => (
          <PageHeader.Column title={col.header}>
            {col.value(resource)}
          </PageHeader.Column>
        ))}
      </PageHeader>

      {customTables.map(obj => (
        <>{obj} </>
      ))}
    </>
  );
}
