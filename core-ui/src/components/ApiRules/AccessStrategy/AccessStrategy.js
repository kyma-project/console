import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon } from 'fundamental-react';

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

const AccessStrategy = ({ strategy }) => {
  const selectedType = strategy.accessStrategies[0].name;

  return (
    <div className="access-strategy" role="row">
      <div className="header">
        <strong className="path">{strategy.path}</strong>
        <div className="type">
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
        </div>
        <div className="methods">
          {strategy.methods
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
      </div>
    </div>
  );
};

AccessStrategy.propTypes = {
  strategy: PropTypes.object.isRequired,
};

export default AccessStrategy;
