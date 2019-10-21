import React from 'react';
import GenericList from '../GenericList';
import renderer from 'react-test-renderer';
import 'core-js/es/array/flat-map';

describe('GenericList', () => {
  const mockHeaderRenderer = entries => ['Name'];
  const mockEntryRenderer = entry => [entry.name];
  const mockEntries = [
    { name: 'first_entry', description: 'testdescription1' },
    { name: 'second_entry', description: 'testdescription2' },
  ];

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <GenericList
        title=""
        entries={[]}
        headerRenderer={() => []}
        rowRenderer={() => []}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders title and description', () => {
    const [title, description] = ['title', 'description'];
    const component = renderer.create(
      <GenericList
        title={title}
        description={description}
        entries={[]}
        headerRenderer={() => []}
        rowRenderer={() => []}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Renders actions button when 'actions' prop is provided", () => {
    const actions = [{ name: 'testaction', handler: () => {} }];

    const component = renderer.create(
      <GenericList
        title=""
        actions={actions}
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockEntryRenderer}
      />,
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("Skips rendering actions when 'actions' prop passes skipAction() call", () => {
    let actions = [
      { name: 'testaction', handler: () => {}, skipAction: () => true },
    ];

    let component = renderer.create(
      <GenericList
        title=""
        actions={actions}
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockEntryRenderer}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
