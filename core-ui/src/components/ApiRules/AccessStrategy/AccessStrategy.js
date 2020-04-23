import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon } from 'fundamental-react';
import classNames from 'classnames';
import accessStrategyTypes, { usesMethods } from '../accessStrategyTypes';

const AccessStrategy = ({ strategy }) => {
  const selectedType = strategy.accessStrategies[0].name;

  return (
    <div className="access-strategy" role="row">
      <div className="header">
        {strategy.path}
        <div className="type">
          <Badge modifier="filled">
            <Icon
              glyph={
                selectedType === accessStrategyTypes.noop.value ||
                selectedType === accessStrategyTypes.allow.value
                  ? 'unlocked'
                  : 'locked'
              }
              size="s"
            />
            {accessStrategyTypes[selectedType].displayName}
          </Badge>
        </div>
        <div
          className={classNames('methods', {
            'fd-hidden': !usesMethods(selectedType),
          })}
        >
          {strategy.methods
            .sort()
            .reverse()
            .map(method => (
              <Badge key={method} aria-label="method">
                {method}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};

AccessStrategy.propTypes = {
  strategy: PropTypes.object.isRequired,
};

export default AccessStrategy;
