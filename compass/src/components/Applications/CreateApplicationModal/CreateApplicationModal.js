import React from "react";

import { Mutation } from "react-apollo";
import { CREATE_APPLICATION_MUTATION } from "../gql";
import { Button, Input, Modal } from "@kyma-project/react-components";
import LuigiClient from "@kyma-project/luigi-client";

import { FormLabel, FormItem, FormSet } from "fundamental-react/lib/Forms";
import JSONEditorComponent from "./../../Shared/JSONEditor";
import { labelsSchema } from "./labelsSchema";

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
      nameFilled: false,
      labelsValidated: true,
      requiredFieldsFilled: false,
      creatingApplication: false
    };
  };

  setInitialState = value => {
    this.setState(this.getInitialState());
  };

  onChangeName = value => {
    this.setState({
      nameFilled: Boolean(value),
      requiredFieldsFilled: Boolean(value) && this.state.labelsValidated,
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
    let labelsValidated = true;

    try {
      formData.labels = JSON.parse(value);
    } catch (err) {
      labelsValidated = false;
    }

    this.setState({
      labels: value,
      formData,
      labelsValidated,
      requiredFieldsFilled: this.state.nameFilled && labelsValidated
    });
  };

  render() {
    const { formData, requiredFieldsFilled } = this.state;

    const createApplicationButton = (
      <Button compact option="light" data-e2e-id="create-application-button" onClick={this.handleOpen}>
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
            />
          </FormItem>
        </FormSet>
      </>
    );

    return (
      <Mutation mutation={CREATE_APPLICATION_MUTATION} variables={{ in: formData }}>
        {(createApplication, result) => {
          const { data, loading, error, called } = result;
          if (loading) {
            return <div>LOADING</div>;
          }

          if (error) {
            console.log("error", error);
            LuigiClient.uxManager().showAlert({
              text: error.message,
              type: "error",
              closeAfter: 2000
            });
          }

          if (called && !error) {
            const createdApp = data.createApplication;
            const { name, id } = createdApp;
            LuigiClient.uxManager().showAlert({
              text: `Created ${name} with id ${id}`,
              type: "success",
              closeAfter: 2000
            });
          }

          return (
            <Modal
              width={"681px"}
              title="Create application"
              type={"emphasized"}
              modalOpeningComponent={createApplicationButton}
              confirmText="Create"
              cancelText="Cancel"
              disabledConfirm={!requiredFieldsFilled}
              onConfirm={createApplication}
              onShow={() => {
                this.setInitialState();
                return LuigiClient.uxManager().addBackdrop();
              }}
              onHide={() => LuigiClient.uxManager().removeBackdrop()}
            >
              {content}
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateApplicationModal;
