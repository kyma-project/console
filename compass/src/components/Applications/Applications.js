import React from "react";
import { Token } from "fundamental-react/lib/Token";
import { Badge, Counter } from "fundamental-react/lib/Badge";

import GenericList from "../../shared/components/GenericList/GenericList";
import { Query } from "react-apollo";
import { GET_APPLICATIONS } from "./gql";
import LuigiClient from "@kyma-project/luigi-client";

class Applications extends React.Component {
  createLabels = labels => {
    const separatedLabels = [];
    for (const key in labels) {
      if (labels.hasOwnProperty(key) && labels[key].length > 0) {
        labels[key].forEach(lab => {
          if (lab === "undefined") {
            separatedLabels.push(key);
          } else {
            separatedLabels.push(key + "=" + lab);
          }
        });
      }
    }
    return separatedLabels.map((label, id) => (
      <Token key={id} className="y-fd-token y-fd-token--no-button y-fd-token--gap">
        {label}
      </Token>
    ));
  };

  processStatus(status) {
    let type = "warning";
    switch (status) {
      case "INITIAL":
        return <Badge>{status}</Badge>;

      case "READY":
        type = "success";
        break;
      case "UNKNOWN":
        type = "warning";
        break;
      case "FAILED":
        type = "error";
        break;
      default:
        type = "warning";
    }

    return <Badge type={type}>{status}</Badge>;
  }

  headerRenderer = applications => ["Name", "Description", "Labels", "APIs", "EventAPIs", "Status"];
  rowRenderer = application => [
    <b>{application.name}</b>,
    application.description,
    application.labels ? this.createLabels(application.labels) : "-",
    <Counter>{application.apis.totalCount}</Counter>,
    <Counter>{application.eventAPIs.totalCount}</Counter>,
    this.processStatus(application.status.condition)
  ];

  actions = [
    {
      name: "Delete",
      handler: entry => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: "Remove application",
            body: `Are you sure you want to delete ${entry.name}?`,
            buttonConfirm: "No",
            buttonDismiss: "Also no"
          })
          .catch(() => {})
          .finally(() => {
            console.warn("As you wish, nothing will be removed");
          });
      }
    }
  ];

  render() {
    return (
      <Query query={GET_APPLICATIONS}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          const apps = data.applications.data;

          return (
            <GenericList
              title="Applications"
              description="List of all aplications"
              actions={this.actions}
              entries={apps}
              headerRenderer={this.headerRenderer}
              rowRenderer={this.rowRenderer}
            />
          );
        }}
      </Query>
    );
  }
}
export default Applications;
