import React, { useState } from 'react';
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
import { StringInput } from 'react-shared';

const AccessStrategy = ({ selectedType, path }) => {
  const [requiredScopeList, setRequiredScopes] = useState(['foo', 'bar']);
  const [trustedIssuesList, setTrustedIssues] = useState([
    'http://dex.kyma.local',
  ]);
  return (
    <Panel className="access-strategy">
      <Panel.Header>
        <Panel.Head title="Access strategy for path " />

        <FormInput
          placeholder="Field placeholder text"
          type="text"
          value={path}
        />
        <Panel.Actions>
          {/* <Button option="emphasized" title="Add new mutator" glyph="add" /> */}
          <Button title="Delete this access strategy" glyph="delete" />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Filters>
        <FormGroup>
          <LayoutGrid cols={2}>
            <FormItem>
              <FormLabel htmlFor="select-1">Type</FormLabel>
              <FormSelect value={selectedType} id="select-1">
                <option value="1">Pass-all</option>
                <option value="2">JWT</option>
                <option value="3">OAuth2</option>
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
                <Checkbox id="checkbox-5" name="checkbox-name-5" value="POST" />
                <Checkbox id="checkbox-6" name="checkbox-name-6" value="PUT" />
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

      {selectedType !== 1 && (
        <Panel.Body>
          <FormGroup>
            <FormItem>
              <FormLabel>trusted_issuers</FormLabel>
              <StringInput
                stringList={trustedIssuesList}
                onChange={setTrustedIssues}
                regexp={new RegExp('(?=.*[A-z])')}
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            {selectedType === 2 && (
              <FormItem>
                <FormLabel>reguired_scope</FormLabel>
                <StringInput
                  stringList={requiredScopeList}
                  onChange={setRequiredScopes}
                  regexp={
                    new RegExp(
                      '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
                    )
                  }
                />
              </FormItem>
            )}
          </FormGroup>
        </Panel.Body>
      )}
    </Panel>
  );
};

export default AccessStrategy;
