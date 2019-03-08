import React from 'react';
import ReactDOM from 'react-dom';
import ODataReact from './ODataReact';
import { PageWrapper } from './components/styled/styled';
import { mocks } from './ODataFiles/index';
import 'fiori-fundamentals/dist/fiori-fundamentals.min.css';
ReactDOM.render(
  <PageWrapper>
    <ODataReact schema={mocks.SAPodata} />
  </PageWrapper>,
  document.getElementById('root'),
);
