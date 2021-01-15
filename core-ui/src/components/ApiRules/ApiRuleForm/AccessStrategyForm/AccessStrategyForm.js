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
  Alert,
} from 'fundamental-react';
import StringListInput from './StringListInput';
import { Tooltip } from 'react-shared';
import JwtDetails from './JwtDetails/JwtDetails';
import classNames from 'classnames';
import accessStrategyTypes, {
  usesMethods,
  supportedMethodsList,
  hasValidMethods,
} from 'components/ApiRules/accessStrategyTypes';

export default function AccessStrategyForm({
  strategy,
  setStrategy,
  removeStrategy,
  canDelete,
  handleFormChanged,
}) {
  const selectedType = strategy.accessStrategies[0].name;

  const deleteButtonWrapper = canDelete
    ? component => component
    : component => (
        <div>
          <Tooltip content="API rule requires at least one access strategy.">
            {component}
          </Tooltip>
        </div>
      );

  return (
    <div role="row">
      <div className="access-strategy access-strategy--form">
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
                  pattern="^[a-z0-9\/\(\)\?.!*\-]+"
                  title="Path must consist of alphanumeric and the following characters: /.*?!-()"
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
                  {Object.values(accessStrategyTypes).map(ac => (
                    <option key={ac.value} value={ac.value}>
                      {ac.displayName}
                    </option>
                  ))}
                </FormSelect>
              </FormItem>
              <MethodsForm
                methods={strategy.methods}
                setMethods={methods => setStrategy({ ...strategy, methods })}
                isRelevant={usesMethods(selectedType)}
              ></MethodsForm>
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
      {!hasValidMethods(strategy) && (
        <Alert type="warning" className="fd-has-margin-bottom-m">
          This access strategy requires at least one method.
        </Alert>
      )}
    </div>
  );
}

AccessStrategyForm.propTypes = {
  strategy: PropTypes.object.isRequired,
  setStrategy: PropTypes.func.isRequired,
  removeStrategy: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
  handleFormChanged: PropTypes.func.isRequired,
};

function Details({ name, ...props }) {
  switch (name) {
    case accessStrategyTypes.oauth2_introspection.value:
      return <OAuth2Details {...props} />;
    case accessStrategyTypes.jwt.value:
      return <JwtDetails {...props} />;
    default:
      return null;
  }
}

function OAuth2Details({ config, setConfig }) {
  return (
    <StringListInput
      list={config?.required_scope || []}
      onChange={scopes => setConfig({ required_scope: scopes })}
      isEditMode={true}
      label="Required scope"
      regexp={/^[^, ]+$/}
    />
  );
}

function MethodsForm({ methods, setMethods, isRelevant }) {
  const AVAILABLE_METHODS = supportedMethodsList;
  const toggleMethod = function(method, checked) {
    if (checked) {
      setMethods([...methods, method]);
    } else {
      const removeIdx = methods.indexOf(method);
      setMethods([
        ...methods.slice(0, removeIdx),
        ...methods.slice(removeIdx + 1, methods.length),
      ]);
    }
  };
  return (
    <FormFieldset className={classNames({ 'fd-hidden': !isRelevant })}>
      <FormRadioGroup inline className="inline-radio-group">
        {AVAILABLE_METHODS.map(m => (
          <Checkbox
            key={m}
            value={m}
            defaultChecked={methods.includes(m)}
            onChange={e => toggleMethod(m, e.target.checked)}
          />
        ))}
      </FormRadioGroup>
    </FormFieldset>
  );
}
