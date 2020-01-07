import React from 'react';

import Toolbar from '../components/Toolbar/Toolbar.component';
import AddonList from './../components/AddonList/AddonList';

import { Wrapper } from './styled';
import './App.scss';

const App: React.FunctionComponent = () => (
  <Wrapper>
    <Toolbar />
    <AddonList />
  </Wrapper>
);

export default App;
