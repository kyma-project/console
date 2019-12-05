import React from 'react';
import { GenericList } from '../GenericList';

import 'core-js/es/array/flat-map';
import { render, fireEvent } from '@testing-library/react';

describe('GenericList', () => {
  // for "Warning: componentWillMount has been renamed"
  console.error = jest.fn();
  console.warn = jest.fn();

  afterEach(() => {
    console.error.mockReset();
    console.warn.mockReset();
  });

  const defaultNotFoundText = 'No entries found';

  const mockHeaderRenderer = entries => ['Name', 'description'];
  const mockEntryRenderer = entry => [entry.name, entry.description];

  const mockEntries = [
    { name: 'first_entry', description: 'testdescription1' },
    { name: 'second_entry', description: 'testdescription2' },
  ];

  it('Renders with minimal props', async () => {
    const { getByText } = render(
      <GenericList
        title=""
        entries={[]}
        headerRenderer={() => []}
        rowRenderer={() => []}
      />,
    );
    await getByText(defaultNotFoundText);
  });

  it('Renders custon notFoundMessage props', async () => {
    const notFoundMessage = 'abcd';
    const { getByText } = render(
      <GenericList
        title=""
        entries={[]}
        headerRenderer={() => []}
        rowRenderer={() => []}
        notFoundMessage={notFoundMessage}
      />,
    );
    await getByText(notFoundMessage);
  });

  it('Renders title', async () => {
    const title = 'title';
    const { getByText } = render(
      <GenericList
        title={title}
        entries={[]}
        headerRenderer={() => []}
        rowRenderer={() => []}
      />,
    );
    await getByText(title);
  });

  it("Renders actions button when 'actions' prop is provided", async () => {
    const actions = [{ name: 'testaction', handler: () => {} }];
    const { getAllByLabelText } = render(
      <GenericList
        actions={actions}
        entries={mockEntries}
        headerRenderer={() => []}
        rowRenderer={() => []}
      />,
    );
    const actionButtons = await getAllByLabelText(actions[0].name);
    expect(actionButtons.length).toBe(mockEntries.length);
  });

  it('Renders entries', async () => {
    const { getByText } = render(
      <GenericList
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockEntryRenderer}
      />,
    );

    mockEntries.forEach(entry =>
      Object.keys(entry).forEach(async key => await getByText(entry[key])),
    );
  });

  it('Renders custom data using custom entryRenderer', async () => {
    const customEntryRenderer = entry => [entry.name, 'maskopatol'];

    const { queryByText } = render(
      <GenericList
        entries={[mockEntries[0]]}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={customEntryRenderer}
      />,
    );

    expect(await queryByText(mockEntries[0].name)).toBeTruthy();
    expect(await queryByText('maskopatol')).toBeTruthy();
    expect(await queryByText(mockEntries[0].description)).toBeNull();
  });

  it('Renders headers', async () => {
    const { getByText } = render(
      <GenericList
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockEntryRenderer}
      />,
    );

    mockHeaderRenderer().forEach(async header => await getByText(header));
  });

  it('Renders extreaHeaderContent', async () => {
    const content = 'wow this is so extra!';
    const { getByText } = render(
      <GenericList
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockEntryRenderer}
        extraHeaderContent={<span>{content}</span>}
      />,
    );

    await getByText(content);
  });

  describe('Search', () => {
    it('Show search field by default', async () => {
      const { getByRole } = render(
        <GenericList
          entries={mockEntries}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
        />,
      );

      await getByRole('search');
    });

    it("Desn't show search field when showSearchField is set to false", async () => {
      const { queryByRole } = render(
        <GenericList
          entries={mockEntries}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
          showSearchField={false}
        />,
      );

      expect(await queryByRole('search')).toBeNull();
    });

    it("Desn't show search field when showSearchField is set to false", async () => {
      const { queryByRole } = render(
        <GenericList
          entries={mockEntries}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
          showSearchField={false}
        />,
      );

      expect(await queryByRole('search')).toBeNull();
    });

    it('Finds proper entries when search text is entered', async () => {
      const searchText = 'first';

      const { queryAllByRole, getByLabelText } = render(
        <GenericList
          entries={mockEntries}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
        />,
      );

      expect(await queryAllByRole('row')).toHaveLength(3); // header + {mockEntries.length} rows

      const searchInput = await getByLabelText('search-input');
      fireEvent.change(searchInput, { target: { value: searchText } });

      expect(await queryAllByRole('row')).toHaveLength(2); // header + one row
    });

    it.todo('shows no entries message when there are no results');
  });

  // it("Skips rendering actions when 'actions' prop passes skipAction() call", () => {
  //   let actions = [
  //     { name: 'testaction', handler: () => {}, skipAction: () => true },
  //   ];

  //   let component = renderer.create(
  //     <GenericList
  //       title=""
  //       actions={actions}
  //       entries={mockEntries}
  //       headerRenderer={mockHeaderRenderer}
  //       rowRenderer={mockEntryRenderer}
  //     />,
  //   );
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});
