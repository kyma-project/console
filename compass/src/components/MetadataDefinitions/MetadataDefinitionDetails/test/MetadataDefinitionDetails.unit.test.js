import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { mocks } from './mock';

import MetadataDefinitionDetails from '../MetadataDefinitionDetails.container';

describe('MetadataDefinitionDetails', () => {
  it('Renders null schema', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitionDetails definitionKey="noschemalabel" />
      </MockedProvider>,
    );

    await wait(0); // wait  response
    expect(queryByText('Schema')).toBeInTheDocument();
    expect(queryByLabelText('schema-editor')).not.toBeInTheDocument();
  });
});
