import React from 'react';
import {
  ActionBar,
  Button,
  LayoutGrid,
  FormGroup,
  FormItem,
  FormLabel,
  Panel,
  FormSelect,
} from 'fundamental-react';

import './ApiRuleCreationDraft.scss';

import AccessStrategy from './AccessStrategy';

const ApiRuleCreationDraft = () => {
  return (
    <>
      <header className="fd-has-background-color-background-2 sticky">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <ActionBar.Header title="multiple-rules" />
          </section>
          <ActionBar.Actions>
            <Button option="emphasized">Save</Button>
          </ActionBar.Actions>
        </section>
      </header>

      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          <Panel>
            <Panel.Header>
              <Panel.Head title="General settings" />
            </Panel.Header>
            <Panel.Body>
              <FormGroup>
                <LayoutGrid cols="3">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <input
                      placeholder="Enter the name"
                      value="multiple-rules"
                      type="text"
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Gateway</FormLabel>
                    <FormSelect value="1" id="select-1">
                      <option value="1">
                        kyma-gateway.kyma-system.svc.cluster.local
                      </option>
                    </FormSelect>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormSelect value="1" id="select-1">
                      <option value="1">
                        foo-service (foo4.kyma.local:8080)
                      </option>
                      <option value="2">
                        bar-service (bar.kyma.local:8080)
                      </option>
                    </FormSelect>
                  </FormItem>
                </LayoutGrid>
              </FormGroup>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Header>
              <Panel.Head title="Access strategies" />
              <Panel.Actions>
                <Button glyph="add">Add access strategy</Button>
              </Panel.Actions>
            </Panel.Header>
            <Panel.Body>
              <AccessStrategy selectedType={'Pass-all'} path="/favicon" />
              <AccessStrategy selectedType={'JWT'} path="/img" />
              <AccessStrategy selectedType={'OAuth2'} path="/headers" />
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </section>
    </>
  );
};

export default ApiRuleCreationDraft;
