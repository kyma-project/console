import React from 'react';
import {
  LayoutGrid,
  FormGroup,
  FormInput,
  FormItem,
  Checkbox,
  FormFieldset,
  FormSelect,
  FormRadioGroup,
  FormLabel,
} from 'fundamental-react';
import { StringInput } from 'react-shared';

const AVAILABLE_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

// const URLregexp = new RegExp(
//   '(https://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
// );

const passAll = {
  value: 'allow',
  displayName: 'Allow',
};
// const jwt = {
//   value: 'jwt',
//   displayName: 'JWT',
// };
const oauth2 = {
  value: 'oauth2_introspection',
  displayName: 'OAuth2',
};
const accessStrategiesList = [passAll, oauth2];

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

export default function AccessStrategyForm({ strategy, setStrategy }) {
  const selectedType = strategy.accessStrategies[0].name;

  function toggleMethod(method, checked) {
    if (checked) {
      setStrategy({ ...strategy, methods: [...strategy.methods, method] });
    } else {
      const removeIdx = strategy.methods.indexOf(method);
      setStrategy({
        ...strategy,
        methods: [
          ...strategy.methods.slice(0, removeIdx),
          ...strategy.methods.slice(removeIdx + 1, strategy.methods.length),
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
                required
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
              <FormSelect
                defaultValue={selectedType}
                aria-label="Access strategy type"
                id="select-1"
                onChange={e =>
                  setStrategy({
                    ...strategy,
                    accessStrategies: [
                      { ...strategy.accessStrategies[0], name: e.target.value },
                    ],
                  })
                }
              >
                {accessStrategiesList.map(ac => (
                  <option key={ac.value} value={ac.value}>
                    {ac.displayName}
                  </option>
                ))}
              </FormSelect>
            </FormItem>
          </LayoutGrid>
        </FormGroup>

        <Details
          {...strategy.accessStrategies[0]}
          setConfig={config =>
            setStrategy({
              ...strategy,
              accessStrategies: [{ ...strategy.accessStrategies[0], config }],
            })
          }
        />
      </div>
    </div>
  );
}

function Details({ name, ...props }) {
  switch (name) {
    case oauth2.value:
      return <OAuth2Details {...props} />;
    default:
      return null;
  }
}

function OAuth2Details({ config, setConfig }) {
  return (
    <StringListInput
      list={config.required_scope || []}
      onChange={scopes => setConfig({ required_scope: scopes })}
      isEditMode={true}
      label="Required scope"
    />
  );
}
