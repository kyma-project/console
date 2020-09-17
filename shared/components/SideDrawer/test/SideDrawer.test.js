import React from 'react';
import { render } from '@testing-library/react';
import { SideDrawer } from '../SideDrawer.js';

describe('SideDrawer', () => {
  const testText1 = 'hi there';
  const testContent1 = <p>{testText1}</p>;

  const testText2 = 'oh, hello';
  const testContent2 = <h3>{testText2}</h3>;

  it('Renders content', () => {
    const { queryByText } = render(
      <SideDrawer isOpenInitially={true}>{testContent1}</SideDrawer>,
    );

    expect(queryByText(testText1)).toBeInTheDocument();
  });

  it('Renders bottom content', () => {
    const { queryByText } = render(
      <SideDrawer bottomContent={testContent2}>{testContent1}</SideDrawer>,
    );

    expect(queryByText(testText2)).toBeInTheDocument();
  });
});
