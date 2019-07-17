import React from "react";
import { graphql, withApollo, compose } from "react-apollo";

import { CREATE_APPLICATION_MUTATION, CHECK_APPLICATION_EXISTS, GET_RUNTIMES } from "../gql";
import { ADD_RUNTIME } from "../../Runtimes/gql";
import { SEND_NOTIFICATION } from "../../../gql";

import CreateApplicationModal from "./CreateApplicationModal.component";

const CreateApplicationContainer = ({ client, ...props }) => {
  const applicationsExists = () => {
    return client.query({
      query: CHECK_APPLICATION_EXISTS,
      variables: {
        filter: [
          {
            label: "group",
            values: ["production", "experimental"],
            operator: "ANY"
          }
        ]
      },
      fetchPolicy: "network-only",
      errorPolicy: "all"
    });
  };
  return <CreateApplicationModal applicationsExists={applicationsExists} {...props} />;
};

const CreateApplicationContainerWithCompose = compose(
  graphql(ADD_RUNTIME, {
    props: ({ mutate }) => ({
      addRuntime: data =>
        mutate({
          variables: {
            in: data
          }
        })
    })
  }),
  graphql(SEND_NOTIFICATION, {
    name: "sendNotification"
  })
)(CreateApplicationContainer);

export default withApollo(CreateApplicationContainerWithCompose);
