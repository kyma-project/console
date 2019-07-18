import React, { useState } from "react";
import PropTypes from "prop-types";
import { withApollo } from "react-apollo";
import LuigiClient from "@kyma-project/luigi-client";

import { FormSet, FormItem, FormInput, FormLabel } from "fundamental-react";
import { Button, Modal } from "@kyma-project/react-components";

import JSONEditorComponent from "./../../../Shared/JSONEditor";
import { labelsSchema } from "./../../../Shared/labelSchema";
import { UPDATE_APPLICATION } from "./../../gql"; //todo orgnize importatas

ApplicationUpdateModal.propTypes = {
  application: PropTypes.object.isRequired
};

function ApplicationUpdateModal(props) {
  //todo clear hooks

  const [name, setName] = useState(props.application.name);
  const [description, setDescription] = useState(props.application.description);
  const [textLabels, setTextLabels] = useState(JSON.stringify(props.application.labels));
  const [areLabelsValid, setAreLabelsValid] = useState(true);

  function isReadyToSave() {
    return name.trim() !== "" && description.trim() !== "" && areLabelsValid;
  }

  function createApplicationInput() {
    // todo 
  }

  const modalOpeningComponent = <Button option="light">Edit</Button>;

  const content = (
    <FormSet>
      <FormItem key="name">
        <FormLabel htmlFor="name" required={true}>
          Name
        </FormLabel>
        <FormInput
          id="name"
          type="text"
          placeholder={"Name"}
          defaultValue={name}
          onChange={e => setName(e.target.value)}
        />
      </FormItem>
      <FormItem key="description">
        <FormLabel htmlFor="description" required={true}>
          Description
        </FormLabel>
        <FormInput
          id="description"
          type="text"
          placeholder={"Description"}
          defaultValue={description}
          onChange={e => setDescription(e.target.value)}
        />
      </FormItem>
      <FormItem key="labels">
        <FormLabel htmlFor="labels">Labels</FormLabel>
        <JSONEditorComponent
          id="labels"
          text={textLabels}
          schema={labelsSchema}
          onChangeText={value => setTextLabels(value)}
          onError={() => setAreLabelsValid(false)}
          onSuccess={() => setAreLabelsValid(true)}
        />
      </FormItem>
    </FormSet>
  );

  async function updateApplication() {
    console.log({
      id: props.application.id,
      in: createApplicationInput()
    });

    try {
      console.log(
        await props.client.mutate({
          mutation: UPDATE_APPLICATION,
          variables: {
            id: props.application.id,
            input: createApplicationInput()
          }
        })
      );
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <Modal
      width={"480px"}
      title="Edit Application"
      confirmText="Update"
      cancelText="Cancel"
      type={"emphasized"}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={updateApplication}
      disableConfirm={!isReadyToSave}
      onShow={() => LuigiClient.uxManager().addBackdrop()}
      onHide={() => LuigiClient.uxManager().removeBackdrop()}
    >
      {content}
    </Modal>
  );
}

export default withApollo(ApplicationUpdateModal);
