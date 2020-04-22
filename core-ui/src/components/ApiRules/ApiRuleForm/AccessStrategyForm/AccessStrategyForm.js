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
import JwtDetails from './JwtDetails/JwtDetails';

// const URLregexp = new RegExp(
//   '(https://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
// );
const passAll = {
  value: 'allow',
  displayName: 'Allow',
};
const noop = {
  value: 'noop',
  displayName: 'noop',
};
const jwt = {
  value: 'jwt',
  displayName: 'JWT',
};
const oauth2 = {
  value: 'oauth2_introspection',
  displayName: 'OAuth2',
};
const accessStrategiesList = [passAll, noop, oauth2, jwt];

export default function AccessStrategyForm({
  strategy,
  setStrategy,
  removeStrategy,
  canDelete,
  idpPresets,
  handleFormChanged,
}) {
  const selectedType = strategy.accessStrategies[0].name;

  const deleteButtonWrapper = canDelete
    ? component => component
    : component => (
        <div>
          <Tooltip title="API rule requires at least one access strategy.">
            {component}
          </Tooltip>
        </div>
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
                pattern="^\/.+"
                title="Path must start with '/' and consist of at least one additional character."
                onChange={e =>
                  setStrategy({ ...strategy, path: e.target.value })
                }
              />
            </FormItem>
            <FormItem>
              <FormSelect
                defaultValue={selectedType}
                aria-label="Access strategy type"
                id="select-1"
                onChange={e => {
                  const newStrategy = {
                    ...strategy,
                    accessStrategies: [
                      {
                        ...strategy.accessStrategies[0],
                        name: e.target.value,
                      },
                    ],
                  };
                  // strategy type changed, reset current values
                  if (e.target.value !== strategy.accessStrategies[0].name) {
                    newStrategy.accessStrategies[0].config = {};
                  }
                  setStrategy(newStrategy);
                  handleFormChanged();
                }}
              >
                {accessStrategiesList.map(ac => (
                  <option key={ac.value} value={ac.value}>
                    {ac.displayName}
                  </option>
                ))}
              </FormSelect>
            </FormItem>
            <HTTPMethods
              strategy={strategy}
              setStrategy={setStrategy}
            ></HTTPMethods>
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
          idpPresets={idpPresets}
          handleFormChanged={handleFormChanged}
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
  idpPresets: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  handleFormChanged: PropTypes.func.isRequired,
};

function Details({ name, ...props }) {
  switch (name) {
    case oauth2.value:
      return <OAuth2Details {...props} />;
    case jwt.value:
      return <JwtDetails {...props} />;
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

function HTTPMethods({ strategy, setStrategy }) {
  const AVAILABLE_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
  const toggleMethod = function(method, checked) {
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
  };
  const methodsIrrelevant =
    strategy.accessStrategies[0] &&
    strategy.accessStrategies[0].name === passAll.value;
  return (
    <FormFieldset>
      <FormRadioGroup inline className="inline-radio-group">
        {AVAILABLE_METHODS.map(m => (
          <Checkbox
            key={m}
            value={m}
            defaultChecked={strategy.methods.includes(m)}
            onChange={e => toggleMethod(m, e.target.checked)}
            disabled={methodsIrrelevant}
          />
        ))}
      </FormRadioGroup>
    </FormFieldset>
  );
}
