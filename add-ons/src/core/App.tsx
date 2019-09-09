import React from 'react';

import Toolbar from '../components/Toolbar/Toolbar.component';
import Table from '../components/Table/Table.container';

import { Wrapper } from './styled';

const App: React.FunctionComponent = () => (
  <Wrapper>
    <Toolbar />
    <Table />
  </Wrapper>
);

export default App;
