import React from "react";
import { graphql, withApollo, compose } from "react-apollo";

import { CREATE_APPLICATION_MUTATION, CHECK_APPLICATION_EXISTS } from "../gql";
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
  graphql(CREATE_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      addApplication: data =>
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
