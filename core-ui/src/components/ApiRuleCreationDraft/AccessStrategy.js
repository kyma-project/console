import React, { useState } from 'react';
import {
  Button,
  LayoutGrid,
  FormGroup,
  FormInput,
  FormItem,
  FormLabel,
  Checkbox,
  FormFieldset,
  Badge,
  FormSelect,
  FormRadioGroup,
  Status,
  Icon,
} from 'fundamental-react';
import { StringInput } from 'react-shared';

const URLregexp = new RegExp(
  '(https://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
);
const StringListInput = ({
  typesFilter,
  selectedType,
  label,
  list,
  onChange,
  regexp,
  isEditMode,
  placeholder,
}) => {
  if (typesFilter && !typesFilter.includes(selectedType)) {
    return null;
  }
  return (
    <div className="string-list-input">
      <FormLabel>{label}:</FormLabel>
      {isEditMode ? (
        <StringInput
          stringList={list}
          onChange={onChange}
          regexp={regexp}
          placeholder={placeholder}
        />
      ) : (
        (list && list.length && (
          <FormInput readOnly value={list.join(', ')} />
        )) ||
        'None'
      )}
    </div>
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

  const [editMode, setEditMode] = useState(isEditModeInitially);

  return (
    <div className="access-strategy">
      <div className="header">
        <strong className="path">{path}</strong>
        <div className="type">
          {!editMode && (
            <Badge modifier="filled">
              <Icon
                glyph={selectedType === 'Pass-all' ? 'unlocked' : 'locked'}
                size="s"
              />
              {selectedType}
            </Badge>
          )}
        </div>
        <div className="methods">
          {!editMode && <Badge>GET</Badge>}
          {!editMode && selectedType === 'OAuth2' && (
            <Badge type="error">DELETE</Badge>
          )}
        </div>
        <div className="actions">
          <label
            title="Edit mode"
            className="fd-form__label edit-toggle"
            for={`check-${path}`}
          >
            <Icon
              glyph="edit"
              size="l"
              style={{
                color: editMode ? 'var(--fd-color-action,#0a6ed1)' : 'inherit',
              }}
            />
            <span className="fd-toggle fd-toggle--s fd-form__control">
              <input
                type="checkbox"
                id={`check-${path}`}
                checked={editMode}
                onChange={e => setEditMode(e.target.checked)}
              />
              <span className="fd-toggle__switch" role="presentation"></span>
            </span>
          </label>

          <Button
            type="negative"
            compact
            title="Delete this access strategy"
            glyph="delete"
          />
        </div>
      </div>

      <div className="content">
        {editMode && (
          <FormGroup>
            <LayoutGrid cols={3}>
              <FormItem>
                <FormInput
                  placeholder="Field placeholder text"
                  type="text"
                  value={path}
                />
              </FormItem>
              {editMode && (
                <FormFieldset>
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
                {editMode ? (
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

        {selectedType !== 'Pass-all' && (
          <>
            <StringListInput
              list={trustedIssuesList}
              onChange={setTrustedIssues}
              isEditMode={editMode}
              typesFilter={['JWT']}
              selectedType={selectedType}
              regexp={URLregexp}
              label="Trusted issuers"
              placeholder="Enter issuer URL, e.g. https://myissuer.com"
            />

            <StringListInput
              list={requiredScopeList}
              onChange={setRequiredScopes}
              isEditMode={editMode}
              label="Required scope"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AccessStrategy;
