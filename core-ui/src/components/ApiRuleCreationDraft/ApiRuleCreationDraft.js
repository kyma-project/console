import React from 'react';
import {
  ActionBar,
  Button,
  LayoutGrid,
  FormGroup,
  FormInput,
  FormItem,
  FormLabel,
  Panel,
  Checkbox,
  FormFieldset,
  FormLegend,
  Badge,
  FormSelect,
  FormSet,
  FormRadioGroup,
  Table,
} from 'fundamental-react';
import PanelEntry from '../../shared/components/PanelEntry/PanelEntry.component';
import { HostWithPortInput, FloatingControls } from 'react-shared';
import './ApiRuleCreationDraft.scss';

const ApiRuleCreationDraft = () => {
  return (
    <>
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <ActionBar.Header title="KKtest" />
          </section>
          <ActionBar.Actions>
            <FloatingControls>
              <Button glyph="add">Add access strategy</Button>

              <Button option="emphasized" glyph="add">
                Add new API rule
              </Button>
            </FloatingControls>
          </ActionBar.Actions>
        </section>
        <LayoutGrid nogap cols={4}>
          <PanelEntry
            title="Name"
            content={
              <input
                placeholder="Field placeholder text"
                value="KKtest"
                type="text"
              />
            }
          />
          <PanelEntry
            title="Gateway"
            content={<input placeholder="Field placeholder text" type="text" />}
          />
        </LayoutGrid>
      </header>

      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          <Panel>
            <Panel.Header>
              <Panel.Head title="Service" />
            </Panel.Header>
            <Panel.Body>
              <FormGroup>
                <LayoutGrid cols={2}>
                  <FormItem>
                    <FormLabel htmlFor="input-1">Name</FormLabel>
                    <FormInput
                      placeholder="Field placeholder text"
                      type="text"
                      value="hasselhoff-beach-rescue-service"
                    />
                  </FormItem>
                  <HostWithPortInput
                    hostInfo={{
                      placeholder: 'Host',
                      value: 'hasselhoff.beach-rescue.california.gov',
                    }}
                    portInfo={{ placeholder: 'Port', value: 6969 }}
                    label="URL"
                  />
                </LayoutGrid>
              </FormGroup>
            </Panel.Body>
          </Panel>

          <Panel className="access-strategy">
            <Panel.Header>
              <Panel.Head title="Access strategy for path " />

              <FormInput
                placeholder="Field placeholder text"
                type="text"
                value="/.*"
              />
              <Panel.Actions>
                <Button
                  option="emphasized"
                  title="Add new mutator"
                  glyph="add"
                />
                <Button title="Delete this access strategy" glyph="delete" />
              </Panel.Actions>
            </Panel.Header>
            <Panel.Filters>
              <FormGroup>
                <LayoutGrid cols={2}>
                  <FormItem>
                    <FormLabel htmlFor="select-1">Type</FormLabel>
                    <FormSelect id="select-1">
                      <option value="1">Strategy one</option>
                      <option value="2">Strategy two</option>
                      <option value="3">Ask Pamela</option>
                    </FormSelect>
                  </FormItem>
                  <FormFieldset>
                    <FormLegend>Method:</FormLegend>
                    <FormRadioGroup inline className="inline-radio-group">
                      <Checkbox
                        id="checkbox-4"
                        name="checkbox-name-4"
                        value="GET"
                        checked
                      />
                      <Checkbox
                        id="checkbox-5"
                        name="checkbox-name-5"
                        value="POST"
                        checked
                      />
                      <Checkbox
                        id="checkbox-6"
                        name="checkbox-name-6"
                        value="PUT"
                      />
                      <Checkbox
                        id="checkbox-6"
                        name="checkbox-name-6"
                        value="DELETE"
                      />
                    </FormRadioGroup>
                  </FormFieldset>
                </LayoutGrid>
              </FormGroup>
            </Panel.Filters>

            <Panel.Body className="mutator-section">
              <Table
                headers={['Upstream', 'Handler', 'Authorizer', ' ']}
                tableData={[
                  {
                    rowData: [
                      <FormItem>
                        <FormInput id="1" value="http://my-backend-service" />
                      </FormItem>,
                      <FormItem>
                        <FormInput id="1" value="anonymous" />
                      </FormItem>,
                      <FormItem>
                        <FormInput id="1" value="allow" />
                      </FormItem>,
                      <Button option="light" glyph="decline" />,
                    ],
                  },
                  {
                    rowData: [
                      <FormItem>
                        <FormInput
                          id="1"
                          value="http://can-i-rescue-people.com"
                        />
                      </FormItem>,
                      <FormItem>
                        <FormInput id="1" value="Mitch" />
                      </FormItem>,
                      <FormItem>
                        <FormInput id="1" value="Mitch's boss" />
                      </FormItem>,
                      <Button option="light" glyph="decline" />,
                    ],
                  },
                  {
                    rowData: [
                      <FormItem>
                        <FormInput id="1" value="David" />
                      </FormItem>,
                      <FormItem>
                        <FormInput id="1" value="is the" />
                      </FormItem>,
                      <FormItem>
                        <FormInput id="1" value="King" />
                      </FormItem>,
                      <Button option="light" glyph="decline" />,
                    ],
                  },
                ]}
              />
            </Panel.Body>
          </Panel>

          <Panel className="access-strategy">
            <Panel.Header>
              <Panel.Head title="Access strategy for path " />

              <FormInput
                placeholder="Field placeholder text"
                type="text"
                value="/this/is/another/path"
              />
              <Panel.Actions>
                <Button
                  option="emphasized"
                  title="Add new mutator"
                  glyph="add"
                />
                <Button title="Delete this access strategy" glyph="delete" />
              </Panel.Actions>
            </Panel.Header>
            <Panel.Filters>
              <FormGroup>
                <LayoutGrid cols={2}>
                  <FormItem>
                    <FormLabel htmlFor="select-1">Type</FormLabel>
                    <FormSelect value="2" id="select-1">
                      <option value="1">Strategy one</option>
                      <option value="2">Strategy two</option>
                      <option value="3">Ask Pamela</option>
                    </FormSelect>
                  </FormItem>
                  <FormFieldset>
                    <FormLegend>Method:</FormLegend>
                    <FormRadioGroup inline className="inline-radio-group">
                      <Checkbox
                        id="checkbox-4"
                        name="checkbox-name-4"
                        value="GET"
                        checked
                      />
                      <Checkbox
                        id="checkbox-5"
                        name="checkbox-name-5"
                        value="POST"
                      />
                      <Checkbox
                        id="checkbox-6"
                        name="checkbox-name-6"
                        value="PUT"
                      />
                      <Checkbox
                        id="checkbox-6"
                        name="checkbox-name-6"
                        value="DELETE"
                        checked
                      />
                    </FormRadioGroup>
                  </FormFieldset>
                </LayoutGrid>
              </FormGroup>
            </Panel.Filters>

            <Panel.Body className="mutator-section">
              <Table
                headers={['Upstream', 'A param to select', ' ']}
                tableData={[
                  {
                    rowData: [
                      <FormItem>
                        <FormInput id="1" value="http://my-backend-service" />
                      </FormItem>,
                      <FormSelect id="select-1" value="1">
                        <option value="1">Yes</option>
                        <option value="2">No</option>
                        <option value="3">Well, it's kinda difficult...</option>
                      </FormSelect>,

                      <Button option="light" glyph="decline" />,
                    ],
                  },
                  {
                    rowData: [
                      <FormItem>
                        <FormInput
                          id="1"
                          value="http://can-i-rescue-people.com"
                        />
                      </FormItem>,
                      <FormSelect id="select-1" value="3">
                        <option value="1">Yes</option>
                        <option value="2">No</option>
                        <option value="3">Well, it's kinda difficult...</option>
                      </FormSelect>,
                      <Button option="light" glyph="decline" />,
                    ],
                  },
                ]}
              />
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </section>
    </>
  );
};

export default ApiRuleCreationDraft;
