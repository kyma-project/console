import React from 'react';
import renderer from 'react-test-renderer';
import Logs from './../Logs';

describe('Logs', () => {
  it('Renders with minimal props', () => {
    console.error = jest.fn();

    afterEach(() => {
      console.error.mockReset();
    });

    afterAll(() => {
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });

    const component = renderer.create(
      <Logs httpService={{}} queryTransformService={{ toQuery: () => {} }} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders with lambda view props', () => {
    console.error = jest.fn();

    afterEach(() => {
      console.error.mockReset();
    });

    afterAll(() => {
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });

    const component = renderer.create(
      <Logs
        httpService={{}}
        queryTransformService={{ toQuery: () => {} }}
        isLambda={true}
        readonlyLabels={[]}
        lambdaName="test"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
