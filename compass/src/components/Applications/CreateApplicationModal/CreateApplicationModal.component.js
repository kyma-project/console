import React from "react";

import { Button, Input, Modal } from "@kyma-project/react-components";
import LuigiClient from "@kyma-project/luigi-client";

import { FormLabel, FormItem, FormSet } from "fundamental-react/lib/Forms";
import JSONEditorComponent from "../../Shared/JSONEditor";
import { labelsSchema } from "./labelsSchema";
import equal from "deep-equal";

import "./styles.scss";

class CreateApplicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      formData: {
        name: "",
        description: "",
        labels: {}
      },
      labels: "{}",
      applicationWithNameAlreadyExists: false,
      invalidApplicationName: false,
      nameFilled: false,
      labelsValidated: true,
      requiredFieldsFilled: false,
      tooltipData: null,
      enableCheckNameExists: false
    };
  };

  refetchApplicationExists = async () => {
    return await this.props.applicationsExists();
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
    const { formData, invalidApplicationName, enableCheckNameExists, nameFilled, labelsValidated } = this.state;

    if (equal(this.state, prevState)) return;

    const requiredFieldsFilled = nameFilled && labelsValidated;

    const tooltipData = !requiredFieldsFilled
      ? {
          type: "error",
          content: "Fill out all mandatory fields"
        }
      : null;

    clearTimeout(this.timer);
    if (
      enableCheckNameExists &&
      !invalidApplicationName &&
      formData &&
      formData.name &&
      typeof this.checkNameExists === "function"
    ) {
      this.timer = setTimeout(() => {
        this.checkNameExists(formData.name);
      }, 250);
    }

    this.setState({
      requiredFieldsFilled,
      tooltipData
    });
  }

  validateApplicationName = value => {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    const wrongApplicationName = value && (!Boolean(regex.test(value || "")) || value.length > 253);
    return wrongApplicationName;
  };

  checkNameExists = async name => {
    const { data, error } = await this.refetchApplicationExists();
    const existingApplications =
      data && data.applications && data.applications.data ? data.applications.data.map(app => app.name) : [];
    const exist = existingApplications.filter(str => {
      return str === name;
    });
    this.setState({
      applicationWithNameAlreadyExists: !error && exist && exist.length
    });
  };

  invalidNameMessage = name => {
    if (!name.length) {
      return "Please enter the name";
    }
    if (name[0] === "-" || name[name.length - 1] === "-") {
      return "The application name cannot begin or end with a dash";
    }
    if (name.length > 253) {
      return "The maximum length of service name is 63 characters";
    }
    return "The application name can only contain lowercase alphanumeric characters or dashes";
  };

  getApplicationNameErrorMessage = () => {
    const { invalidApplicationName, applicationWithNameAlreadyExists, formData } = this.state;

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
        name: value
      }
    });
  };

  onChangeDescription = value => {
    this.setState({
      formData: {
        ...this.state.formData,
        description: value
      }
    });
  };

  onChangeLabel = (value, ss) => {
    let formData = this.state.formData;
    try {
      formData.labels = JSON.parse(value);
    } catch (err) {}

    this.setState({
      labels: value,
      formData
    });
  };

  setLabelsAsValid = value => {
    this.setState({
      labelsValidated: Boolean(value)
    });
  };

  createApplication = async () => {
    let success = true;

    const { formData } = this.state;
    const { addRuntime, sendNotification } = this.props;
    try {
      let createdApplicationName;
      const createdApplication = await addRuntime(formData);
      if (
        createdApplication &&
        createdApplication.data &&
        createdApplication.data.createRuntime &&
        createdApplication.data.createRuntime.name
      ) {
        createdApplicationName = createdApplication.data.createRuntime.name;
      }

      if (typeof sendNotification === "function") {
        sendNotification({
          variables: {
            content: `Application binding "${createdApplicationName}" created successfully`,
            title: `${createdApplicationName}`,
            color: "#359c46",
            icon: "accept",
            instanceName: createdApplicationName
          }
        });
      }
    } catch (e) {
      success = false;

      this.setState({
        tooltipData: {
          type: "error",
          title: "Error occored during creation",
          content: e.message,
          show: true,
          minWidth: "261px"
        }
      });
    }
    if (success) {
      this.clearState();
      LuigiClient.uxManager().removeBackdrop();
    }
  };

  render() {
    const {
      formData,
      requiredFieldsFilled,
      tooltipData,
      invalidApplicationName,
      applicationWithNameAlreadyExists
    } = this.state;
    const createApplicationButton = (
      <Button compact option="light" data-e2e-id="create-application-button">
        + Create Application
      </Button>
    );

    const content = (
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

        <FormSet className="margin-top">
          <FormItem>
            <FormLabel>Labels</FormLabel>
            <JSONEditorComponent
              text={this.state.labels}
              schema={labelsSchema}
              onChangeText={this.onChangeLabel}
              onError={() => this.setLabelsAsValid(false)}
              onSuccess={() => this.setLabelsAsValid(true)}
            />
          </FormItem>
        </FormSet>
      </>
    );

    return (
      <Modal
        width={"681px"}
        title="Create application"
        type={"emphasized"}
        modalOpeningComponent={createApplicationButton}
        confirmText="Create"
        disabledConfirm={!requiredFieldsFilled}
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
