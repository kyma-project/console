import React from 'react';
import { GET_RUNTIME } from '../gql';
import { Query } from 'react-apollo';

import { Button } from 'fundamental-react/lib/Button';

import LuigiClient from "@kyma-project/luigi-client";
import { Badge } from "fundamental-react/lib/Badge";
import { Panel } from "fundamental-react/lib/Panel";
import LabelDisplay from '../../Shared/LabelDisplay';

const RuntimeDetails = ({ runtimeId }) => {
  return (
    <Query query={GET_RUNTIME} variables={{ id: runtimeId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        const { name, description, id, status, labels } = data.runtime;
        return (
          <>
            <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
              <section className="fd-section">
                <div className="fd-action-bar">
                  <div className="fd-action-bar__header">
                    <h3 className="fd-action-bar__title">{name}</h3>
                    <div className="fd-action-bar__description">
                      <div className="fd-container fd-container--fluid">
                        <div className="fd-col--4">
                          Description
                          <span className="columns__value">{description}</span>
                        </div>
                        <div className="fd-col--4">
                          ID
                          <span className="columns__value">{id}</span>
                        </div>
                        {status && (
                          <div className="fd-col--4">
                            Status
                            <span className="columns__value">
                              <Badge>{status.condition}</Badge>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="fd-container fd-container--fluid">
<<<<<<< HEAD
                        {labels &&
                          Object.keys(labels) && (
                            <div className="fd-col--4">
                              Labels
                              <LabelDisplay
                                labels={labels}
                                className="columns__value"
                              />
                            </div>
                          )}
=======
                        {labels && Object.keys(labels) && (
                          <div className="fd-col--4">
                            Labels
                            <LabelDisplay
                              labels={labels}
                              className="columns__value"
                            />
                          </div>
                        )}
>>>>>>> ebd243023e1f150079c50c0bc53ba66d73d638f8
                      </div>
                    </div>
                  </div>
                  <div className="fd-action-bar__actions">
                    <Button
                      onClick={() =>
                        LuigiClient.uxManager().showAlert({
                          text: "Hola Amigo, you can't do it yet",
                          type: 'warning',
                          closeAfter: 2000,
                        })
                      }
                      type="negative"
                      option="light"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </section>
            </header>
            <section className="fd-section">
              <Panel>
                <Panel.Header>
                  <Panel.Head title="Have you ever wondered what's inside a runtime?" />
                </Panel.Header>
              </Panel>
            </section>
          </>
        );
      }}
    </Query>
  );
};

export default RuntimeDetails;
