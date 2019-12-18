import React from 'react';

import { FormItem, FormLabel, FormSelect } from 'fundamental-react';

const ServicesDropdown = ({ _ref, loading, data, error }) => {
  if (loading) {
    return 'Loading services...';
  }

  if (error) {
    return "Couldn't load services list " + error.message;
  }

  return (
    <FormItem>
      <FormLabel htmlFor="service">Service</FormLabel>
      <FormSelect ref={_ref} id="service" role="select">
        {data.services.map(service =>
          service.ports.map(port => (
            <option
              aria-label="option"
              key={service.name + port.port}
              value={service.name + ':' + port.port}
            >
              {service.name} (port: {port.port})
            </option>
          )),
        )}
      </FormSelect>
    </FormItem>
  );
};

export default ServicesDropdown;
