import React from "react";

import { Panel } from "fundamental-react/lib/Panel";
import { TableWithActionsToolbar, Search, Filter } from "@kyma-project/react-components";
import { Query } from "react-apollo";
import { GET_APPLICATIONS } from "./gql";
import ApplicationsList from "../../shared/components/ApplicationsList/ApplicationsList";

const actions = (
  <>
    <Filter
      filter={[
        {
          count: 3,
          name: "name",
          value: "name"
        }
      ]}
      onChange={() => {}}
    />
    <Search />
  </>
);

const headerRenderer = applications => ["Name", <span style={{ color: "violet" }}>Description</span>];
const rowRenderer = application => [<b>{application.name}</b>, application.description];

const mockData = [{ name: "abc", description: "def" }, { name: "masko", description: "patol" }];

const Applications = () => (
  <Query query={GET_APPLICATIONS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      return (
        <Panel>
          <TableWithActionsToolbar title="Applications" description="Description" children={actions} />
          <ApplicationsList entries={mockData} {...{ headerRenderer, rowRenderer }} />
        </Panel>
      );
    }}
  </Query>
);

export default Applications;
