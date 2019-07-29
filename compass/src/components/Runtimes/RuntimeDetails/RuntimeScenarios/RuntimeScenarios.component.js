import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';

import GenericList from '../../../../shared/components/GenericList/GenericList';

RuntimeScenarios.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function RuntimeScenarios(props) {
  const headerRenderer = () => ['Name'];
  const rowRenderer = label => [<b>{label.scenario}</b>];

  return (
    <Panel>
      <GenericList
        title="Scenarios"
        notFoundMessage="This Runtime isn't assigned to any scenario"
        entries={props.scenarios}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
