import React from "react";

import { Panel } from "fundamental-react/lib/Panel";
import { TableWithActionsToolbar, Search, Filter } from "@kyma-project/react-components"; 
import { Query } from "react-apollo";
import { GET_APPLICATIONS } from "./gql";
import ApplicationsList from "./ApplicationsList/ApplicationsList";


const Applications = () => (
  <Query query={GET_APPLICATIONS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const apps = data.applications.data;
      
      const actions = (apps) => (
        <>
          <Filter
            data={apps}
            onChange={() => {}}/>
            <Search/>
        </>
      )

      return (
        <Panel>
          <TableWithActionsToolbar 
            title="Applications"
            description="Description"
            children={actions(apps)}/>
          <ApplicationsList data={apps}></ApplicationsList>
        </Panel>
      )
    }}
  </Query>
);

export default Applications;
