import React from 'react';
import { GET_RUNTIME } from '../gql';
import { Query } from 'react-apollo';
import { ActionBar } from 'fundamental-react/lib/ActionBar';
import { Button } from 'fundamental-react/lib/Button';
import { Panel } from 'fundamental-react/lib/Panel';
import LuigiClient from '@kyma-project/luigi-client';
const RuntimeDetails = ({ runtimeId }) => {
  return (
    <Query query={GET_RUNTIME} variables={{ id: runtimeId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        console.log(data);
        return (
          <>
            <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
              <section className="fd-section">
                <div className="fd-action-bar">
                  <div className="fd-action-bar__header">
                    <h3 className="fd-action-bar__title">
                      {data.runtime.name}
                    </h3>
                    <div className="fd-action-bar__description">
                      <div className="fd-container fd-container--fluid">
                        <div className="fd-col--4">
                          Description
                          <span className="columns__value">
                            {data.runtime.description}
                          </span>
                        </div>
                        <div className="fd-col--4">
                          ID
                          <span className="columns__value">
                            {data.runtime.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="fd-action-bar__actions">
                    <Button
                      onClick={() =>
                        LuigiClient.uxManager().showAlert({
                          text: "Hola Amigo, you can't do it yet",
                          type: 'warning',
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
            <section className="fd-section">asasd</section>
          </>
        );
      }}
    </Query>
  );
};

export default RuntimeDetails;
