import React from 'react';
import { render } from '@testing-library/react';
import { SideDrawerEditor } from '../SideDrawerEditor.js';

describe('SideDrawerEditor', () => {
  const testText = 'oh, hello';
  const testContent = <h3>{testText}</h3>;

  const jsonContent = {
    one: '1',
    two: '2',
  };

  // content inside comes from the monaco-editor so it's difficult to test
  it('Renders bottom content', () => {
    const { queryByText } = render(
      <SideDrawerEditor bottomContent={testContent} content={jsonContent} />,
    );

    expect(queryByText(testText)).toBeInTheDocument();
  });
});
