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

export default function AccessStrategyForm({ strategy, setStrategy }) {
  // const [requiredScopeList, setRequiredScopes] = useState(['foo', 'bar']);
  // const [trustedIssuesList, setTrustedIssues] = useState([
  //   'http://dex.kyma.local',
  // ]);
  const selectedType = strategy.accessStrategies[0].name;

  function toggleMethod(method, checked) {
    if (checked) {
      setStrategy({ ...strategy, methods: [...strategy.methods, method] });
    } else {
      const removeIdx = strategy.methods.indexOf(method);
      console.log(method, checked, strategy, removeIdx);
      setStrategy({
        ...strategy,
        methods: [
          ...strategy.methods.slice(0, removeIdx),
          ...strategy.methods.slice(removeIdx + 1, strategy.methods),
        ],
      });
    }
  }

  return (
    <div className="access-strategy" role="row">
      <div className="content">
        <FormGroup>
          <LayoutGrid cols={3}>
            <FormItem>
              <FormInput
                placeholder="Enter the path"
                type="text"
                value={strategy.path}
                onChange={e =>
                  setStrategy({ ...strategy, path: e.target.value })
                }
              />
            </FormItem>
            <FormFieldset>
              <FormRadioGroup inline className="inline-radio-group">
                {AVAILABLE_METHODS.map(m => (
                  <Checkbox
                    key={m}
                    value={m}
                    checked={strategy.methods.includes(m)}
                    onChange={e => toggleMethod(m, e.target.checked)}
                  />
                ))}
              </FormRadioGroup>
            </FormFieldset>
            <FormItem>
              <FormSelect defaultValue={selectedType} id="select-1">
                {accessStrategiesList.map(ac => (
                  <option key={ac.value} value={ac.value}>
                    {ac.displayName}
                  </option>
                ))}
              </FormSelect>
            </FormItem>
          </LayoutGrid>
        </FormGroup>

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
}
