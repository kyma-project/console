import React from 'react';
import {
  ActionBar,
  Button,
  PanelGrid,
  FormGroup,
  FormInput,
  FormItem,
  FormLabel,
  Panel,
} from 'fundamental-react';
import PanelEntry from '../../shared/components/PanelEntry/PanelEntry.component';
import HostWithPortInput from '../../shared/components/HostWithPortInput/HostWithPortInput';

const ApiRuleCreationDraft = () => {
  return (
    <>
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <ActionBar.Header title="KKtest" />
          </section>
        </section>
        <PanelGrid nogap cols={4}>
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
        </PanelGrid>
      </header>

      <section className="fd-section">
        <Panel>
          <Panel.Header>
            <Panel.Head title="Service" />
          </Panel.Header>
          <Panel.Body>
            <FormGroup>
              <FormItem>
                <FormLabel htmlFor="input-1">Name</FormLabel>
                <FormInput placeholder="Field placeholder text" type="text" />
              </FormItem>
              <HostWithPortInput
                hostInfo={{ placeholder: 'Host' }}
                portInfo={{ placeholder: 'Port' }}
                label="URL"
              />
            </FormGroup>
          </Panel.Body>
        </Panel>
      </section>
    </>
  );
};

export default ApiRuleCreationDraft;
