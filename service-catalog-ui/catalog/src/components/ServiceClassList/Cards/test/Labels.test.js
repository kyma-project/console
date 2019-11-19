import renderer from 'react-test-renderer';
import React from 'react';
import { Labels } from '../Labels';

describe('Labels', () => {
  it('Render no labels', () => {
    const component = renderer.create(<Labels labels={null} />);
    expect(component).toMatchSnapshot();
  });
  it('Render empty labels', () => {
    const component = renderer.create(<Labels labels={{}} />);
    expect(component).toMatchSnapshot();
  });
  it('Render skips "local"', () => {
    const component = renderer.create(
      <Labels labels={{ local: 'true', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render skips "provisionOnlyOnce"', () => {
    const component = renderer.create(
      <Labels labels={{ provisionOnlyOnce: 'true', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render keeps "true" "showcase', () => {
    const component = renderer.create(
      <Labels labels={{ showcase: 'true', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render keeps "TrUe" "showcase', () => {
    const component = renderer.create(
      <Labels labels={{ showcase: 'TrUe', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render skips with not "true" "showcase', () => {
    const component = renderer.create(
      <Labels labels={{ showcase: 'false', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render skips empty "connected-app"', () => {
    const component = renderer.create(
      <Labels labels={{ 'connected-app': '', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
  it('Render value of "connected-app"', () => {
    const component = renderer.create(
      <Labels labels={{ 'connected-app': 'application', random: 'value' }} />,
    );
    expect(component).toMatchSnapshot();
  });
});
