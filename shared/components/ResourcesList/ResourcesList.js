import React from 'react';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import { Link, Button } from 'fundamental-react';
import { createPatch } from 'rfc6902';
import Moment from 'react-moment';
import {
  YamlEditorProvider,
  GenericList,
  Labels,
  useYamlEditor,
  useNotification,
  useGetList,
  useUpdate,
  useDelete,
  PageHeader,
  navigateToDetails,
} from '../..';
import CustomPropTypes from '../../typechecking/CustomPropTypes';
import { ModalWithForm } from '../ModalWithForm/ModalWithForm';

ResourcesList.propTypes = {
  customColumns: CustomPropTypes.customColumnsType,
  createResourceForm: PropTypes.node,
  customHeaderActions: PropTypes.node,
  resourceUrl: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  namespace: PropTypes.string,
  hasDetailsView: PropTypes.bool,
  isCompact: PropTypes.bool,
  showTitle: PropTypes.bool,
  filter: PropTypes.func,
};

ResourcesList.defaultProps = {
  customHeaderActions: null,
  customColumns: [],
  createResourceForm: null,
  showTitle: false,
};

export function ResourcesList(props) {
  if (!props.resourceUrl) {
    return <></>; // wait for the context update
  }

  return (
    <YamlEditorProvider>
      {!props.isCompact && (
        <PageHeader
          title={props.resourceType}
          actions={props.customHeaderActions}
        />
      )}
      <Resources {...props} />
    </YamlEditorProvider>
  );
}

export const ResourcesListProps = ResourcesList.propTypes;

function Resources({
  resourceUrl,
  resourceType,
  namespace,
  customColumns,
  createResourceForm,
  hasDetailsView,
  showTitle,
  filter,
  ...params
}) {
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const updateResourceMutation = useUpdate(resourceUrl);
  const deleteResourceMutation = useDelete(resourceUrl);
  const { loading = true, error, data: resources, silentRefetch } = useGetList(
    filter,
  )(resourceUrl, { pollingInterval: 3000 });

  const handleSaveClick = resourceData => async newYAML => {
    try {
      const diff = createPatch(resourceData, jsyaml.safeLoad(newYAML));
      const url = resourceUrl + '/' + resourceData.metadata.name;
      await updateResourceMutation(url, diff);
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

  async function handleResourceDelete(resource) {
    const url = resourceUrl + '/' + resource.metadata.name;
    try {
      await deleteResourceMutation(url);
      notification.notifySuccess({ title: 'Succesfully deleted Resource' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to delete the Resource',
        content: e.message,
      });
      throw e;
    }
  }

  const actions = [
    {
      name: 'Edit',
      handler: resource => {
        const { status, ...otherResourceData } = resource; // remove 'status' property because you can't edit it anyway; TODO: decide if it's good
        setEditedSpec(otherResourceData, handleSaveClick(otherResourceData));
      },
    },
    {
      name: 'Delete',
      handler: handleResourceDelete,
    },
  ];

  const headerRenderer = () => [
    'Name',
    'Age',
    'Labels',
    ...customColumns.map(col => col.header),
  ];

  const rowRenderer = entry => [
    hasDetailsView ? (
      <Link onClick={_ => navigateToDetails(resourceType, entry.metadata.name)}>
        {entry.metadata.name}
      </Link>
    ) : (
      <b>{entry.metadata.name}</b>
    ),
    <Moment utc fromNow>
      {entry.metadata.creationTimestamp}
    </Moment>,
    <div style={{ maxWidth: '55em' /*TODO*/ }}>
      <Labels labels={entry.metadata.labels} />
    </div>,
    ...customColumns.map(col => col.value(entry)),
  ];

  const ResourceCreateModal = ({ ResourcesCreateForm, ...params }) => {
    const { resourceType } = params;
    const modalOpeningComponent = (
      <Button glyph="add" option="light">
        Create {resourceType}
      </Button>
    );

    return (
      <ModalWithForm
        title={`Create ${resourceType}`}
        modalOpeningComponent={modalOpeningComponent}
        confirmText="Create"
        id={`add-${resourceType}-modal`}
        className="fd-modal--xl-size"
        renderForm={props => <ResourcesCreateForm {...params} {...props} />}
      />
    );
  };

  return (
    <GenericList
      title={showTitle ? resourceType : null}
      textSearchProperties={['metadata.name']}
      actions={actions}
      entries={resources || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverErrorMessage={error?.message}
      serverDataLoading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
      extraHeaderContent={
        createResourceForm ? (
          <ResourceCreateModal
            ResourcesCreateForm={createResourceForm}
            resourceType={resourceType}
            resourceUrl={resourceUrl}
            namespace={namespace}
            refetchList={silentRefetch}
            {...params}
          />
        ) : null
      }
    />
  );
}
