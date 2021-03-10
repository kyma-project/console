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

  if (error || (!loading && !data)) {
    return "Couldn't load service list " + error.message;
  }

  const defaultService = defaultValue
    ? `${defaultValue.name}:${defaultValue.port}`
    : null;

  const services =
    serviceName && serviceName !== 'undefined'
      ? data.filter(s => s.metadata.name === serviceName)
      : data;

  return (
    <FormItem>
      <FormLabel htmlFor="service">Service</FormLabel>
      <FormSelect
        ref={_ref}
        id="service"
        role="select"
        required
        defaultValue={defaultService}
      >
        {services.length ? (
          services.map(service =>
            service.spec.ports.map(port => (
              <option
                aria-label="option"
                key={service.metadata.name + port.port}
                value={`${service.metadata.name}:${port.port}`}
              >
                {service.metadata.name} (port: {port.port})
              </option>
            )),
          )
        ) : (
          <option disabled>No services in this namespace</option>
        )}
      </FormSelect>
    </FormItem>
  );
};

ServicesDropdown.propTypes = {
  _ref: CustomPropTypes.ref,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  error: PropTypes.object,
  defaultValue: PropTypes.object,
  serviceName: PropTypes.string,
};

export default ServicesDropdown;
