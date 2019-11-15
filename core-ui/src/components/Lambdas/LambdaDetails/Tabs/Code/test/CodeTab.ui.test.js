import React from 'react';
import renderer from 'react-test-renderer';

import CodeTab from './../CodeTab';

describe('Lambda Code Tab', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <CodeTab
        codeEditorComponent={<p>Code</p>}
        dependenciesComponent={<p>Dependencies</p>}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
