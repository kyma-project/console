import React, { useState } from 'react';
import {
  // Button,
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

const passAll = {
  value: 'allow',
  displayName: 'Allow',
};
const jwt = {
  value: 'jwt',
  displayName: 'JWT',
};
const oauth2 = {
  value: 'oauth2_introspection',
  displayName: 'OAuth2',
};
const accessStrategiesList = [passAll, jwt, oauth2];

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
  path,
  strategy,
  isOpenInitially = false,
  isEditModeInitially = false,
}) => {
  const [requiredScopeList, setRequiredScopes] = useState(['foo', 'bar']);
  const [trustedIssuesList, setTrustedIssues] = useState([
    'http://dex.kyma.local',
  ]);
  const selectedType = strategy.accessStrategies[0].name;

  const [editMode, setEditMode] = useState(isEditModeInitially);

  return (
    <div className="access-strategy" role="row">
      <div className="header">
        <strong className="path">{path}</strong>
        <div className="type">
          {!editMode && (
            <Badge modifier="filled">
              <Icon
                glyph={selectedType === passAll.value ? 'unlocked' : 'locked'}
                size="s"
              />
              {
                accessStrategiesList.find(item => item.value === selectedType)
                  .displayName
              }
            </Badge>
          )}
        </div>
        <div className="methods">
          {!editMode &&
            strategy.methods &&
            strategy.methods.length &&
            strategy.methods.sort().map(method => {
              if (method === 'DELETE') return null;
              return <Badge>{method}</Badge>;
            })}

          {!editMode && strategy.methods.includes('DELETE') && (
            <Badge type="error">DELETE</Badge>
          )}
        </div>
        {/*  TODO Uncoment for updating access strategies
        <div className="actions">
          <label
            title="Edit mode"
            className="fd-form__label edit-toggle"
            htmlFor={`check-${path}`}
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
        </div> */}
      </div>

      <div className="content">
        {editMode && (
          <FormGroup>
            <LayoutGrid cols={3}>
              <FormItem>
                <FormInput
                  placeholder="Field placeholder text"
                  type="text"
                  defaultValue={path}
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
                      checked={strategy.methods.includes('DELETE')}
                    />
                  </FormRadioGroup>
                </FormFieldset>
              )}
              <FormItem>
                {editMode ? (
                  <FormSelect defaultValue={selectedType} id="select-1">
                    {accessStrategiesList.map(ac => (
                      <option key={ac.value} value={ac.value}>
                        {ac.displayName}
                      </option>
                    ))}
                  </FormSelect>
                ) : (
                  <Status>{selectedType}</Status>
                )}
              </FormItem>
            </LayoutGrid>
          </FormGroup>
        )}

        {selectedType !== passAll.value && (
          <>
            <StringListInput
              list={trustedIssuesList}
              onChange={setTrustedIssues}
              isEditMode={editMode}
              typesFilter={[jwt.value]}
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
