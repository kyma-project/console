import React, { useState } from 'react';
import {
  // Button,
  LayoutGrid,
  FormGroup,
  FormInput,
  FormItem,
  // FormLabel,
  Checkbox,
  FormFieldset,
  Badge,
  FormSelect,
  FormRadioGroup,
  Status,
  Icon,
} from 'fundamental-react';
// import { StringInput } from 'react-shared';

const AVAILABLE_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

// const URLregexp = new RegExp(
//   '(https://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
// );

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

// const StringListInput = ({
//   typesFilter,
//   selectedType,
//   label,
//   list,
//   onChange,
//   regexp,
//   isEditMode,
//   placeholder,
// }) => {
//   if (typesFilter && !typesFilter.includes(selectedType)) {
//     return null;
//   }
//   return (
//     <div className="string-list-input">
//       <FormLabel>{label}:</FormLabel>
//       {isEditMode ? (
//         <StringInput
//           stringList={list}
//           onChange={onChange}
//           regexp={regexp}
//           placeholder={placeholder}
//         />
//       ) : (
//         (list && list.length && (
//           <FormInput readOnly value={list.join(', ')} />
//         )) ||
//         'None'
//       )}
//     </div>
//   );
// };

const AccessStrategy = ({
  strategy,
  // isOpenInitially = false,
  isEditModeInitially = false,
}) => {
  // const [requiredScopeList, setRequiredScopes] = useState(['foo', 'bar']);
  // const [trustedIssuesList, setTrustedIssues] = useState([
  //   'http://dex.kyma.local',
  // ]);
  const selectedType = strategy.accessStrategies[0].name;

  const [editMode /*setEditMode*/] = useState(isEditModeInitially);

  return (
    <div className="access-strategy" role="row">
      <div className="header">
        <strong className="path">{strategy.path}</strong>
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
            strategy.methods
              .sort()
              .reverse()
              .map(method => (
                <Badge
                  key={method}
                  aria-label="method"
                  type={method === 'DELETE' ? 'error' : null}
                >
                  {method}
                </Badge>
              ))}
        </div>
        {/*  TODO Uncoment for updating access strategies
        <div className="actions">
          <label
            title="Edit mode"
            className="fd-form__label edit-toggle"
            htmlFor={`check-${strategy.path}`}
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
                id={`check-${strategy.path}`}
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
                  placeholder="Enter the path"
                  type="text"
                  defaultValue={strategy.path}
                />
              </FormItem>
              {editMode && (
                <FormFieldset>
                  <FormRadioGroup inline className="inline-radio-group">
                    {AVAILABLE_METHODS.map(m => (
                      <Checkbox
                        key={m}
                        value={m}
                        checked={strategy.methods.includes(m)}
                      />
                    ))}
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

        {/* {selectedType !== passAll.value && (
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
        )} */}
      </div>
    </div>
  );
};

export default AccessStrategy;
