import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { toAPI, toEventAPI, fromAPI, areApisEqual } from './APIViewModel';

import EditApiHeader from './Header/EditApiHeader.container';
import EditApiTabs from './EditApiTabs.component';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

export default class EditApi extends React.Component {
  state = { canSaveChanges: false };
  formRef = React.createRef();

  static propTypes = {
    apiId: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,

    apiDataQuery: PropTypes.object.isRequired,
    sendNotification: PropTypes.func.isRequired,
    updateAPI: PropTypes.func.isRequired,
    updateEventAPI: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.apiDataQuery.loading || nextProps.apiDataQuery.error) {
      return null;
    }
    if (!prevState.originalApi) {
      const originalApiData = EditApi.getOriginalApiData(nextProps);
      if (!originalApiData) {
        return null;
      }
      const apiViewModel = fromAPI(originalApiData);

      return {
        apiId: originalApiData.entry.id,
        originalApi: apiViewModel,
        editedApi: apiViewModel,
      };
    }
    return null;
  }

  static getOriginalApiData(nextProps) {
    // we have to filter apis manuallly for now
    // https://github.com/kyma-incubator/compass/issues/234
    const { apiDataQuery, apiId } = nextProps;
    const query = apiDataQuery.application;
    const api = query.apis.data.find(api => api.id === apiId);
    if (api) {
      return {
        type: 'API',
        entry: api,
      };
    }
    const eventApi = query.eventAPIs.data.find(api => api.id === apiId);
    if (eventApi) {
      return {
        type: 'Event API',
        entry: eventApi,
      };
    }
    return null;
  }

  updateApiData = key => values => {
    const updatedApiData = { ...this.state.editedApi };
    updatedApiData[key] = { ...updatedApiData[key], ...values };

    this.setState({ editedApi: updatedApiData }, () => {
      this.setState({
        canSaveChanges: this.checkCanSaveChanges(),
      });
    });
  };

  saveChanges = async () => {
    const { editedApi, apiId } = this.state;
    const { updateAPI, updateEventAPI, sendNotification } = this.props;
    const apiName = editedApi.generalInformation.name;

    try {
      if (editedApi.apiType === 'API') {
        const newApi = toAPI(editedApi);
        await updateAPI(apiId, newApi);
      } else {
        const newApi = toEventAPI(editedApi);
        await updateEventAPI(apiId, newApi);
      }
      this.setState({ originalApi: editedApi });
      sendNotification({
        variables: {
          content: `Updated API "${apiName}".`,
          title: `${apiName}`,
          color: '#359c46',
          icon: 'accept',
          instanceName: apiName,
        },
      });
      LuigiClient.uxManager().setDirtyStatus(false);
    } catch (e) {
      console.warn(e);
      LuigiClient.uxManager().showAlert({
        text: `Error occured while updating the api: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  checkCanSaveChanges = () => {
    const { originalApi, editedApi } = this.state;

    const form = this.formRef.current;
    const isFormValid = form && form.checkValidity();

    const dataChanged = !areApisEqual(editedApi, originalApi);
    const isSpecValid = editedApi.spec.isSpecValid;

    LuigiClient.uxManager().setDirtyStatus(dataChanged);

    return dataChanged && isFormValid && isSpecValid;
  };

  // prevent submit when user clicks on dropdown (or any other button inside form)
  overrideSubmit = e => {
    e.preventDefault();
  };

  render() {
    const apiDataQuery = this.props.apiDataQuery;
    if (apiDataQuery.loading) {
      return <p>Loading...</p>;
    }
    if (apiDataQuery.error) {
      return <p>`Error! ${apiDataQuery.error.message}`</p>;
    }

    const { originalApi, editedApi } = this.state;
    if (!originalApi) {
      return <ResourceNotFound resource="API" breadcrumb="Applications" />;
    }

    return (
      <>
        <EditApiHeader
          apiData={originalApi}
          applicationName={apiDataQuery.application.name}
          saveChanges={this.saveChanges}
          canSaveChanges={this.state.canSaveChanges}
        />
        <form
          ref={this.formRef}
          className="edit-api-tabs"
          onSubmit={this.overrideSubmit}
        >
          <EditApiTabs editedApi={editedApi} updateState={this.updateApiData} />
        </form>
      </>
    );
  }
}
