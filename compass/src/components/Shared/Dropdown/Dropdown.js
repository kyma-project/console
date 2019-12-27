import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Button,
  Dropdown as FdDropdown,
  Menu,
  Popover,
} from 'fundamental-react';
import './Dropdown.scss';

// TODO move to 'react-shared' after shared receives fundamental update

export const Dropdown = ({
  options,
  selectedOption,
  onSelect,
  disabled,
  className,
  width,
}) => {
  const dropdownClassNames = classNames('dropdown', className);

  const optionsList = (
    <Menu>
      <Menu.List>
        {Object.keys(options).map(key => (
          <Menu.Item onClick={() => onSelect(key)} key={key}>
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
    <FdDropdown className={dropdownClassNames} style={{ width }}>
      <Popover
        body={optionsList}
        control={control}
        widthSizingType="matchTarget"
        placement="bottom"
      />
    </FdDropdown>
  );
};

Dropdown.propTypes = {
  options: PropTypes.object.isRequired,
  selectedOption: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  width: PropTypes.string,
};
