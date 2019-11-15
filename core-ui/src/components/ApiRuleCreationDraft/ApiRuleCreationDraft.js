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
                    portInfo={{ placeholder: 'Port', value: '6969' }}
                    label="URL"
                  />
                </LayoutGrid>
              </FormGroup>
            </Panel.Body>
          </Panel>
          <AccessStrategy selectedType={1} />
          <AccessStrategy selectedType={2} />
        </LayoutGrid>
      </section>
    </>
  );
};

export default ApiRuleCreationDraft;
