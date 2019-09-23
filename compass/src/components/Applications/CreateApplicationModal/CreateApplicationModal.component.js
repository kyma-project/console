import React from 'react';
import equal from 'deep-equal';
import PropTypes from 'prop-types';
import { Button, Input, Modal } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import MultiChoiceList from '../../Shared/MultiChoiceList/MultiChoiceList.component';
import './styles.scss';

class CreateApplicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = this.getInitialState();
  }

  PropTypes = {
    existingApplications: PropTypes.array.isRequired,
    applicationsQuery: PropTypes.object.isRequired,
    addApplication: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    scenariosQuery: PropTypes.object.isRequired,
  };

  getInitialState = () => {
    return {
      formData: {
        name: '',
        description: '',
        labels: {},
      },
      applicationWithNameAlreadyExists: false,
      invalidApplicationName: false,
      nameFilled: false,
      requiredFieldsFilled: false,
      tooltipData: null,
      enableCheckNameExists: false,
    };
  };

  updateCurrentScenarios = scenarios => {
    this.setState({
      formData: {
        ...this.state.formData,
        labels: scenarios && scenarios.length ? { scenarios } : {},
      },
    });
  };

  refetchApplicationExists = async () => {
    return await this.props.existingApplications.refetch();
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.clearState();
  }

  componentDidMount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      formData,
      invalidApplicationName,
      enableCheckNameExists,
      nameFilled,
    } = this.state;

    if (equal(this.state, prevState)) return;

    const requiredFieldsFilled = nameFilled;

    const tooltipData = !requiredFieldsFilled
      ? {
          type: 'error',
          content: 'Fill out all mandatory fields',
        }
      : null;

    clearTimeout(this.timer);
    if (
      enableCheckNameExists &&
      !invalidApplicationName &&
      formData &&
      formData.name &&
      typeof this.checkNameExists === 'function'
    ) {
      this.timer = setTimeout(() => {
        this.checkNameExists(formData.name);
      }, 250);
    }

    this.setState({
      requiredFieldsFilled,
      tooltipData,
    });
  }

  validateApplicationName = value => {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    const wrongApplicationName =
      value && (!Boolean(regex.test(value || '')) || value.length > 253);
    return wrongApplicationName;
  };

  checkNameExists = async name => {
    const existingApplications =
      (this.props.existingApplications &&
        this.props.existingApplications.applications) ||
      {};
    const error =
      this.props.existingApplications && this.props.existingApplications.error;
    const existingApplicationsArray =
      existingApplications && existingApplications.data
        ? existingApplications.data.map(app => app.name)
        : [];
    const exist = existingApplicationsArray.filter(str => {
      return str === name;
    });
    this.setState({
      applicationWithNameAlreadyExists: !error && exist && exist.length,
    });
  };

  invalidNameMessage = name => {
    if (!name.length) {
      return 'Please enter the name';
    }
    if (name[0] === '-' || name[name.length - 1] === '-') {
      return 'The application name cannot begin or end with a dash';
    }
    if (name.length > 253) {
      return 'The maximum length of service name is 63 characters';
    }
    return 'The application name can only contain lowercase alphanumeric characters or dashes';
  };

  getApplicationNameErrorMessage = () => {
    const {
      invalidApplicationName,
      applicationWithNameAlreadyExists,
      formData,
    } = this.state;

    if (invalidApplicationName) {
      return this.invalidNameMessage(formData.name);
    }

    if (applicationWithNameAlreadyExists) {
      return `Application with name "${formData.name}" already exists`;
    }

    return null;
  };

  onChangeName = value => {
    this.setState({
      enableCheckNameExists: true,
      nameFilled: Boolean(value),
      applicationWithNameAlreadyExists: false,
      invalidApplicationName: this.validateApplicationName(value),
      formData: {
        ...this.state.formData,
        name: value,
      },
    });
  };

  onChangeDescription = value => {
    this.setState({
      formData: {
        ...this.state.formData,
        description: value,
      },
    });
  };

  createApplication = async () => {
    let success = true;

    const { formData } = this.state;
    const { addApplication, sendNotification } = this.props;

    try {
      let createdApplicationName;
      const createdApplication = await addApplication(formData);
      if (
        createdApplication &&
        createdApplication.data &&
        createdApplication.data.createApplication
      ) {
        createdApplicationName = createdApplication.data.createApplication.name;
      }

      sendNotification({
        variables: {
          content: `Application "${createdApplicationName}" created successfully`,
          title: `${createdApplicationName}`,
          color: '#359c46',
          icon: 'accept',
          instanceName: createdApplicationName,
        },
      });
    } catch (e) {
      success = false;
      LuigiClient.uxManager().showAlert({
        text: `Error occured when creating the application: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }

    if (success) {
      this.clearState();
      await this.refetchApplicationExists();
      this.props.applicationsQuery.refetch();
      LuigiClient.uxManager().removeBackdrop();
    }
  };

  render() {
    const {
      formData,
      requiredFieldsFilled,
      tooltipData,
      invalidApplicationName,
      applicationWithNameAlreadyExists,
    } = this.state;
    const createApplicationButton = (
      <Button glyph="add" data-e2e-id="create-application-button">
        Create Application
      </Button>
    );

    const scenariosQuery = this.props.scenariosQuery;
    if (scenariosQuery.loading) {
      return <p>Loading...</p>;
    }

    let content;
    if (scenariosQuery.error) {
      content = `Error! ${scenariosQuery.error.message}`;
    } else {
      const availableScenarios = JSON.parse(
        scenariosQuery.labelDefinition.schema,
      ).items.enum;

      content = (
        <>
          <Input
            label="Name"
            placeholder="Name of the Application"
            value={formData.name}
            name="applicationName"
            handleChange={this.onChangeName}
            isError={invalidApplicationName || applicationWithNameAlreadyExists}
            message={this.getApplicationNameErrorMessage()}
            required={true}
            type="text"
          />

          <Input
            label="Description"
            placeholder="Description of the Application"
            value={formData.description}
            name="applicationName"
            handleChange={this.onChangeDescription}
            marginTop={15}
            type="text"
          />
          <div className="fd-has-color-text-3 fd-has-margin-top-small fd-has-margin-bottom-tiny">
            Scenarios
          </div>
          <MultiChoiceList
            placeholder="Choose scenarios..."
            notSelectedMessage=""
            currentlySelectedItems={[]}
            updateItems={this.updateCurrentScenarios}
            currentlyNonSelectedItems={availableScenarios}
            noEntitiesAvailableMessage="No more scenarios available"
          />
        </>
      );
    }

    return (
      <Modal
        width={'681px'}
        title="Create application"
        type={'emphasized'}
        modalOpeningComponent={createApplicationButton}
        confirmText="Create"
        disabledConfirm={
          !requiredFieldsFilled ||
          applicationWithNameAlreadyExists ||
          invalidApplicationName
        }
        tooltipData={tooltipData}
        onConfirm={this.createApplication}
        handleClose={this.clearState}
        onShow={() => {
          return LuigiClient.uxManager().addBackdrop();
        }}
        onHide={() => {
          this.clearState();
          LuigiClient.uxManager().removeBackdrop();
        }}
      >
        {content}
      </Modal>
    );
  }
}

export default CreateApplicationModal;
