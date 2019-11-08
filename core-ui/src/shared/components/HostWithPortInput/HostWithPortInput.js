import React from 'react';
import { FormItem, FormInput, FormLabel } from 'fundamental-react';
import './HostWithPortInput.scss';

const HostWithPortInput = ({ hostInfo = {}, portInfo = {}, label }) => (
  <FormItem>
    <FormLabel htmlFor="input-host">{label}</FormLabel>
    <div className="host-with-port">
      <FormInput
        className="host"
        id="input-host"
        placeholder={hostInfo.placeholder || ''}
        type="text"
        value={hostInfo.value || ''}
      />
      <span className="separator">:</span>
      <FormInput
        className="port"
        id="input-port"
        placeholder={portInfo.placeholder || ''}
        type="text"
        value={portInfo.value || ''}
      />
    </div>
  </FormItem>
);
export default HostWithPortInput;
