import React from 'react';
import { Panel, Search } from '@kyma-project/react-components';
import './LogTable.scss';

export default function(props) {
  return (
    <Panel>
      <h1>Logs</h1>

      <Search className="aaa"
        onEnter={function C() {}}
        placeholder="Enter a fruit"
        searchList={[
          {
            callback: function C() {},
            text: 'orange',
          },
        ]}
      />
    </Panel>
  );
}
