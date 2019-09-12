import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SelectDropdown.scss';

import { Popover, Menu, Button } from 'fundamental-react';

SelectDropdown.propTypes = {
  availabelValues: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  currentValue: PropTypes.string.isRequired,
  icon: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

SelectDropdown.defaultProps = {
  icon: '',
  compact: false,
};

export default function SelectDropdown({
  availabelValues,
  currentValue,
  icon,
  updateValue,
  compact,
}) {
  const popoverContent = (
    <Menu>
      <Menu.List>
        {availabelValues.map(value => (
          <Menu.Item onClick={() => updateValue(value)}>
            <span
              className={classNames('caption-muted', {
                'fd-has-font-weight-bold': value === currentValue,
              })}
            >
              {value}
            </span>
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );

  return (
    <span className="link-button fd-has-type-minus-1 select-dropdown">
      <Popover
        body={popoverContent}
        control={
          <Button
            glyph={icon}
            option="light"
            className="fd-has-margin-right-tiny"
            size="xs"
          >
            {!compact && currentValue}
          </Button>
        }
        placement={compact ? 'bottom-end' : 'bottom-start'}
      />
    </span>
  );
}
