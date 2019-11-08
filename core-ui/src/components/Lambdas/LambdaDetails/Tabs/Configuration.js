import React from 'react';
import PropTypes from 'prop-types';
import { Panel, FormItem, FormLabel } from 'fundamental-react';

const ConfigurationTab = ({
  lambda,
  formRef,
  sizeRef,
  runtimeRef,
  LabelsEditor,
}) => {
  return (
    <Panel className="fd-has-margin-medium">
      <Panel.Header>
        <Panel.Head title="General Configuration" />
      </Panel.Header>
      <Panel.Body>
        <form onSubmit={e => e.preventDefault()} ref={formRef}>
          {LabelsEditor}
          <FormItem>
            <FormLabel htmlFor="lambdaSize">Size*</FormLabel>
            <select id="lambdaSize" defaultValue={lambda.size} ref={sizeRef}>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="lambdaRuntime">Runtime*</FormLabel>
            <select
              id="lambdaRuntime"
              defaultValue={lambda.runtime}
              ref={runtimeRef}
            >
              <option value="nodejs6">Nodejs 6</option>
              <option value="nodejs8">Nodejs 8</option>
            </select>
          </FormItem>
        </form>
      </Panel.Body>
    </Panel>
  );
};

ConfigurationTab.propTypes = {
  lambda: PropTypes.object.isRequired,
  formRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  sizeRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  runtimeRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  LabelsEditor: PropTypes.element.isRequired,
};

export default ConfigurationTab;
