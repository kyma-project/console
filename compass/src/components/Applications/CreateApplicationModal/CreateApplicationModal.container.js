import { graphql, compose } from "react-apollo";

import { CREATE_APPLICATION_MUTATION } from "../gql";
import { GET_RUNTIMES, ADD_RUNTIME } from "../../Runtimes/gql";
import { SEND_NOTIFICATION } from "../../../gql";

import CreateApplicationModal from "./CreateApplicationModal.component";

export default compose(
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
)(CreateApplicationModal);
