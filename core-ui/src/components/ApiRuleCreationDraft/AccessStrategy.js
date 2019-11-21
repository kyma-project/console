import React, { useState, useEffect } from 'react';
import {
  Button,
  LayoutGrid,
  FormGroup,
  FormInput,
  FormItem,
  FormLabel,
  Checkbox,
  FormFieldset,
  FormLegend,
  Badge,
  FormSelect,
  FormRadioGroup,
  Status,
  Icon,
} from 'fundamental-react';
import { StringInput } from 'react-shared';

const URLregexp = new RegExp(
  '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
);
const StringListInput = ({
  typesFilter,
  selectedType,
  label,
  list,
  onChange,
  regexp,
  isEditMode,
}) => {
  if (typesFilter && !typesFilter.includes(selectedType)) {
    return null;
  }
  return (
    <FormGroup>
      <FormItem>
        <FormLabel>{label}</FormLabel>
        {isEditMode ? (
          <StringInput stringList={list} onChange={onChange} regexp={regexp} />
        ) : (
          (list && list.length && (
            <FormInput readOnly value={list.join(', ')} />
          )) ||
          'None'
        )}
      </FormItem>
    </FormGroup>
  );
};

const AccessStrategy = ({
  selectedType,
  path,
  isOpenInitially = false,
  isEditModeInitially = false,
}) => {
  const [requiredScopeList, setRequiredScopes] = useState(['foo', 'bar']);
  const [trustedIssuesList, setTrustedIssues] = useState([
    'http://dex.kyma.local',
  ]);

  const [isOpen, setOpen] = useState(isOpenInitially);
  const [isEditMode, setEditMode] = useState(isEditModeInitially);

  useEffect(() => {
    if (isEditMode) {
      setOpen(true);
    }
  }, [isEditMode, setOpen]);

  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
    }
  }, [isOpen, setEditMode]);

  return (
    <div className="access-strategy">
      <div className="header">
        <strong className="path">{path}</strong>

        <Badge modifier="filled" className="type">
          <Icon
            glyph={selectedType === 'Pass-all' ? 'unlocked' : 'locked'}
            size="s"
          />
          {selectedType}
        </Badge>

        <div className="methods">
          {!isEditMode && <Badge>GET</Badge>}
          {!isEditMode && selectedType === 'OAuth2' && (
            <Badge type="error">DELETE</Badge>
          )}
        </div>
        <div className="actions">
          {!isEditMode && (
            <Button
              compact
              title="Edit"
              glyph="edit"
              onClick={() => setEditMode(true)}
            />
          )}
          {(selectedType !== 'Pass-all' || isEditMode) && (
            <Button
              compact
              title={isOpen ? 'Collapse' : 'Expand'}
              glyph={isOpen ? 'navigation-up-arrow' : 'navigation-down-arrow'}
              onClick={() => setOpen(!isOpen)}
            />
          )}

          <Button compact title="Delete this access strategy" glyph="delete" />
        </div>
      </div>
      {isOpen && isEditMode && (
        <FormGroup>
          <LayoutGrid cols={3}>
            <FormItem>
              <FormLabel htmlFor="select-1">Path</FormLabel>
              <FormInput
                placeholder="Field placeholder text"
                type="text"
                value={path}
              />
            </FormItem>
            {isEditMode && (
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
                    checked={selectedType === 3}
                  />
                </FormRadioGroup>
              </FormFieldset>
            )}
            <FormItem>
              <FormLabel htmlFor="select-1">Type</FormLabel>
              {isEditMode ? (
                <FormSelect value={selectedType} id="select-1">
                  <option value="Pass-all">Pass-all</option>
                  <option value="JWT">JWT</option>
                  <option value="OAuth2">OAuth2</option>
                </FormSelect>
              ) : (
                <Status>{selectedType}</Status>
              )}
            </FormItem>
          </LayoutGrid>
        </FormGroup>
      )}

      {isOpen && selectedType !== 'Pass-all' && (
        <>
          <StringListInput
            list={trustedIssuesList}
            onChange={setTrustedIssues}
            isEditMode={isEditMode}
            typesFilter={['JWT']}
            selectedType={selectedType}
            regexp={URLregexp}
            label={'Trusted issuers'}
          />

          <StringListInput
            list={requiredScopeList}
            onChange={setRequiredScopes}
            isEditMode={isEditMode}
            regexp={new RegExp('(?=.*[A-z])')}
            label={'Required scope'}
          />
        </>
      )}
    </div>
  );
};

export default AccessStrategy;
