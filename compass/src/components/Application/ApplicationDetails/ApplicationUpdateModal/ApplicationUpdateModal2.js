import React, { useState } from "react";
import PropTypes from 'prop-types';
import LuigiClient from "@kyma-project/luigi-client";
import { FormSet, FormItem, FormInput, FormLabel } from "fundamental-react";
import { Button, Modal } from "@kyma-project/react-components";
import JSONEditorComponent from "./../../../Shared/JSONEditor";
import { labelsSchema } from "./../../../Shared/labelSchema";
import { withApollo } from "react-apollo";
import { UPDATE_APPLICATION } from "./../../gql"; //todo orgnize importatas

ApplicationUpdateModal.propTypes = {
  application: PropTypes.object.isRequired
}

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
    console.log({name,
      description,
      labels: JSON.parse(textLabels),
      annotations: props.application.annotations,
      webhooks: props.application.webhooks,
      healthCheckURL: props.application.healthCheckURL,
      apis: props.application.apis,
      eventAPIs: props.application.eventAPIs,
      documents: props.application.documents})

    return {
      name,
      description,
      labels: JSON.parse(textLabels),
      annotations: props.application.annotations,
      webhooks: props.application.webhooks,
      healthCheckURL: props.application.healthCheckURL,
      apis: props.application.apis,
      eventAPIs: props.application.eventAPIs,
      documents: props.application.documents
    };
  }

  const modalOpeningComponent = (
    <Button option="light">
      Edit
    </Button>
  );

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
      })


      try {
        console.log(await props.client.mutate({
          mutation: UPDATE_APPLICATION,
          variables: {
            id: props.application.id,
            input: createApplicationInput() }
          }));
      }
      catch(e) {
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

//   variables={{ id: props.application.id, in: createApplicationInput }}
//   mutation={UPDATE_APPLICATION}
//   onCompleted={() => {
//     console.log("SUCCESS");
//   }}
// //   update={(store, { data }) => {
// //     console.log("STORE: ", store);
// //     console.log("DATA: ", data);
// //   }}

  // return (
  //   <>
      {/* {(updateApplication, result) => {
        console.log("result: ",result);
        const { data, loading, error, called, client } = result;
        if (loading) {
          return <div>Loading</div>;
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
            console.log("data: ", data);
          const createdApp = data.updateApplication;
          const { name, id } = createdApp;
          LuigiClient.uxManager().showAlert({
            text: `Updated ${name} with id ${id}`,
            type: "success",
            closeAfter: 2000
          });
          console.log("called", called, result);
        } */}
    //   }}
    // </>
    //     );
}



// const ApplicationUpdateModalithCompose = compose(
//   graphql(SEND_NOTIFICATION, {
//     name: 'sendNotification',
//   }),
// )(CreateCredentialsModal);

export default withApollo(ApplicationUpdateModal);

