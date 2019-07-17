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
      creatingApplication: false,
      tooltipData: null
    };
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      formData,
      invalidInstanceName,
      instanceWithNameAlreadyExists,
      enableCheckNameExists,
      requiredFieldsFilled
    } = this.state;

    if (equal(this.state, prevState)) return;

    const stepFilled = formData.name && !invalidInstanceName && !instanceWithNameAlreadyExists;

    this.setState({
      stepFilled
    });

    const tooltipData = !requiredFieldsFilled
      ? {
          type: "error",
          content: "Fill out all mandatory fields"
        }
      : null;

    clearTimeout(this.timer);
    if (
      enableCheckNameExists &&
      !invalidInstanceName &&
      formData &&
      formData.name &&
      typeof this.checkNameExists === "function"
    ) {
      this.timer = setTimeout(() => {
        this.checkNameExists(formData.name);
      }, 250);
    }
  }

  clearState = () => {
    console.log("clearState");
    this.setState(this.getInitialState());
  };

  validateApplicationName = value => {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    this.wrongApplicationName = value && (!Boolean(regex.test(value || "")) || value.length > 253);
  };

  checkNameExists = async name => {
    const { data, error } = await this.props.refetchInstanceExists(name);

    this.setState({
      instanceWithNameAlreadyExists: !error && data && data.serviceInstance !== null
    });
  };

  onChangeName = value => {
    this.setState({
      nameFilled: Boolean(value),
      requiredFieldsFilled: Boolean(value) && this.state.labelsValidated,
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
      labelsValidated: Boolean(value),
      requiredFieldsFilled: Boolean(value) && this.state.nameFilled
    });
  };

  createApplication = async () => {
    let success = true;

    this.setState({
      creatingApplication: true
    });
    const { formData } = this.state;
    const { addRuntime, sendNotification } = this.props;
    try {
      let createdApplicationName;
      const createdApplication = await addRuntime({});
      console.log("createdApplication", createdApplication);
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
      console.log("createdApplication failed", e);
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
    const { formData, requiredFieldsFilled, tooltipData, creatingApplication } = this.state;
    console.log("props", this.props, creatingApplication);
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
        cancelText="Cancel"
        disabledConfirm={!requiredFieldsFilled}
        tooltipData={tooltipData}
        onConfirm={this.createApplication}
        waiting={creatingApplication}
        onShow={() => {
          return LuigiClient.uxManager().addBackdrop();
        }}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {content}
      </Modal>
    );
  }
}

export default CreateApplicationModal;
