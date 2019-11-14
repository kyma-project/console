import React from 'react';

import Toolbar from '../components/Toolbar/Toolbar.component';
import AddonList from './../components/AddonList/AddonList';
// import Table from '../components/Table/Table.container';

import { Wrapper } from './styled';
import './App.scss';

const App: React.FunctionComponent = () => (
  <Wrapper>
    <Toolbar />
    {/* <Table /> */}
    <AddonList />
  </Wrapper>
);

export default App;
