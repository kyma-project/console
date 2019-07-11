import React from "react";

import GenericList from "../../shared/components/GenericList/GenericList";
import { Query } from "react-apollo";
import { GET_APPLICATIONS } from "./gql";

class Applications extends React.Component {

  createLabels = (labels) => {
    const separatedLabels = [];
    for (const key in labels) {
      if (labels.hasOwnProperty(key) && labels[key].length > 0) {
        labels[key].forEach(lab => {
        if (lab === 'undefined') {
          separatedLabels.push(key);
        } else {
          separatedLabels.push(key + '=' + lab);
        } 
      });
      }
    }
    const labelsString = separatedLabels.join(', ')
    return labelsString;
  }

  headerRenderer = application => ["Name", "Description", "Labels"];
  rowRenderer = application => [<b>{application.name}</b>, application.description, application.labels ? this.createLabels(application.labels) : '-'];

  render() {
    return (
      <Query query={GET_APPLICATIONS}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          const apps = data.applications.data;

          return (
            <GenericList entries={apps} headerRenderer={this.headerRenderer} rowRenderer={this.rowRenderer} />
          )
        }}
      </Query>
    );
  }

}
export default Applications;
