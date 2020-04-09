import React from 'react';
import PropTypes from 'prop-types';

import { CustomPropTypes } from 'react-shared';
import { FormItem, FormLabel, FormSelect } from 'fundamental-react';

const ServicesDropdown = ({
  _ref,
  loading,
  data,
  error,
  defaultValue,
  serviceName,
}) => {
  if (loading) {
    return 'Loading services...';
  }

  if (error) {
    return "Couldn't load services list " + error.message;
  }

  const defaultService = defaultValue
    ? `${defaultValue.name}:${defaultValue.port}`
    : null;

  const getServices = () => {
    if (serviceName) {
      return data.services.filter(s => s.name === serviceName);
    }
    return data.services;
  };

  return (
    <FormItem>
      <FormLabel htmlFor="service">Service</FormLabel>
      <FormSelect
        ref={_ref}
        id="service"
        role="select"
        defaultValue={defaultService}
      >
        {getServices().map(service =>
          service.ports.map(port => (
            <option
              aria-label="option"
              key={service.name + port.port}
              value={`${service.name}:${port.port}`}
            >
              {service.name} (port: {port.port})
            </option>
          )),
        )}
      </FormSelect>
    </FormItem>
  );
};

ServicesDropdown.propTypes = {
  _ref: CustomPropTypes.ref,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  error: PropTypes.object,
  defaultValue: PropTypes.object,
  serviceName: PropTypes.string,
};

export default ServicesDropdown;
