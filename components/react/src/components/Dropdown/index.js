import React from 'react';
import PropTypes from 'prop-types';

import { Popover } from './styled';
import { Dropdown as DropDownWrapper } from 'fundamental-react';

const Dropdown = ({
  disabled = false,
  children,
  control,
  noArrow,
  placement = 'bottom-end',
}) => (
  <DropDownWrapper>
    <Popover
      disabled={disabled}
      noArrow={noArrow}
      placement={placement}
      control={control}
      body={children}
    />
  </DropDownWrapper>
);

Dropdown.propTypes = {
  children: PropTypes.any.isRequired,
  enabled: PropTypes.bool,
  control: PropTypes.any.isRequired,
  noArrow: PropTypes.bool,
  placement: PropTypes.string,
};

export default Dropdown;
