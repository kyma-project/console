import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  LayoutGrid,
  FormGroup,
  FormInput,
  FormItem,
  Checkbox,
  FormFieldset,
  FormSelect,
  FormRadioGroup,
} from 'fundamental-react';
import StringListInput from './StringListInput';
import { Tooltip } from 'react-shared';

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

export default function AccessStrategyForm({
  strategy,
  setStrategy,
  removeStrategy,
  canDelete,
}) {
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

  const deleteButtonWrapper = canDelete
    ? component => component
    : component => (
        <Tooltip title="API rule requires at least one access strategy.">
          {component}
        </Tooltip>
      );

  return (
    <div className="access-strategy access-strategy--form" role="row">
      <div className="content">
        <FormGroup>
          <LayoutGrid cols={3}>
            <FormItem>
              <FormInput
                placeholder="Enter the path"
                type="text"
                value={strategy.path}
                required
                aria-label="Access strategy path"
                pattern="^\/.*.{1,}"
                title="Path must start with '/' and consist of at least one additional character."
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
                    defaultChecked={strategy.methods.includes(m)}
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
      {deleteButtonWrapper(
        <Button
          glyph="delete"
          type="negative"
          typeAttr="button"
          className="remove-access-strategy fd-has-margin-left-m"
          aria-label="remove-access-strategy"
          onClick={removeStrategy}
          disabled={!canDelete}
        />,
      )}
    </div>
  );
}

AccessStrategyForm.propTypes = {
  strategy: PropTypes.object.isRequired,
  setStrategy: PropTypes.func.isRequired,
  removeStrategy: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
};

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
      regexp={/^[^, ]+$/}
    />
  );
}
