import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SelectDropdown.scss';

import { Popover, Menu, Button } from 'fundamental-react';

const SelectDropdownValue = PropTypes.oneOf([
  PropTypes.string,
  PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
]);

SelectDropdown.propTypes = {
  availabelValues: PropTypes.arrayOf(SelectDropdownValue).isRequired,
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
        {availabelValues.map(value => {
          const v = value.value ? value.value : value;
          const l = value.label ? value.label : value;
          return (
            <Menu.Item key={v} onClick={() => updateValue(v)}>
              <span
                className={classNames('caption-muted', {
                  'fd-has-font-weight-bold': v === currentValue,
                })}
              >
                {l}
              </span>
            </Menu.Item>
          );
        })}
      </Menu.List>
    </Menu>
  );

  const currentLabel = availabelValues
    .filter(value => value === currentValue || value.value === currentValue)
    .map(value => (value.label ? value.label : value))[0];

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
            {!compact && currentLabel}
          </Button>
        }
        placement={compact ? 'bottom-end' : 'bottom-start'}
      />
    </span>
  );
}
