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

import AccessStrategy from './AccessStrategy';

const ApiRuleCreationDraft = () => {
  return (
    <>
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <ActionBar.Header title="multiple-rules" />
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
      </header>

      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          <Panel>
            <Panel.Header>
              <Panel.Head title="General settings" />
            </Panel.Header>
            <Panel.Body>
              <FormGroup>
                <LayoutGrid cols="2">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <input
                      placeholder="Enter the name"
                      value="multiple-rules"
                      type="text"
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormSelect value="1" id="select-1">
                      <option value="1">foo-service</option>
                      <option value="2">bar-service</option>
                    </FormSelect>
                  </FormItem>
                </LayoutGrid>
              </FormGroup>
            </Panel.Body>
          </Panel>
          <AccessStrategy selectedType={1} path="/favicon" />
          <AccessStrategy selectedType={2} path="/img" />
          <AccessStrategy selectedType={3} path="/headers" />
        </LayoutGrid>
      </section>
    </>
  );
};

export default ApiRuleCreationDraft;
