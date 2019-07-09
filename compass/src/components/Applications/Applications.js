import React from "react";

import { Panel } from "fundamental-react/lib/Panel";
import { TableWithActionsToolbar, Search, Filter } from "@kyma-project/react-components"; 
import { Query } from "react-apollo";
import { GET_APPLICATIONS } from "./gql";
import ApplicationsList from "./ApplicationsList/ApplicationsList";

const actions = (
  <div>
    <Search/>
    <Filter
      filter={[{
        count: 3,
        name: "name",
        value: "name"
      }]}
      onChange={() => {}}/>
  </div>
)

const Applications = () => (
  <Query query={GET_APPLICATIONS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      return (
        <Panel>
          <TableWithActionsToolbar 
            title="Applications"
            description="Description"
            children={actions}/>
          <ApplicationsList data={data}></ApplicationsList>
        </Panel>
      )
    }}
  </Query>
);

export default Applications;
