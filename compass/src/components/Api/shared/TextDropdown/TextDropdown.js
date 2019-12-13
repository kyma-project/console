import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dropdown, Menu, Popover } from 'fundamental-react';
import './TextDropdown.scss';

TextDropdown.propTypes = {
  selectedOption: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  selectOption: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default function TextDropdown({
  options,
  selectedOption,
  selectOption,
  disabled,
  className,
}) {
  const optionsList = (
    <Menu>
      <Menu.List>
        {Object.keys(options).map(key => (
          <Menu.Item onClick={() => selectOption(key)} key={key}>
            {options[key]}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );

  const control = (
    <Button
      className="fd-dropdown__control format-dropdown__control"
      typeAttr="button"
      disabled={disabled}
    >
      {options[selectedOption]}
    </Button>
  );

  return (
    <Dropdown className={className}>
      <Popover
        body={optionsList}
        control={control}
        widthSizingType="matchTarget"
        placement="bottom"
      />
    </Dropdown>
  );
}
