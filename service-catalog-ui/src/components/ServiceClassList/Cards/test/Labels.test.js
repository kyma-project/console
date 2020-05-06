import { render } from 'enzyme';
import React from 'react';
import { Labels } from '../Labels';
import { expectKnownConsoleWarnings } from '../../../../testing';

const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
});
describe('Labels', () => {
  it('Render no labels', () => {
    const component = render(<Labels labels={null} />);
    expect(component).toMatchSnapshot();
  });
  it('Render empty labels', () => {
    const component = render(<Labels labels={{}} />);
    expect(component).toMatchSnapshot();
  });
  it('Render skips "local"', () => {
    const component = render(
      <Labels labels={{ local: 'true', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render skips "provisionOnlyOnce"', () => {
    const component = render(
      <Labels labels={{ provisionOnlyOnce: 'true', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render keeps "true" "showcase', () => {
    const component = render(
      <Labels labels={{ showcase: 'true', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render keeps "TrUe" "showcase', () => {
    const component = render(
      <Labels labels={{ showcase: 'TrUe', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render skips with not "true" "showcase', () => {
    const component = render(
      <Labels labels={{ showcase: 'false', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render skips empty "connected-app"', () => {
    const component = render(
      <Labels labels={{ 'connected-app': '', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render value of "connected-app"', () => {
    const component = render(
      <Labels labels={{ 'connected-app': 'application', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
});
