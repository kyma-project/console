import React from 'react';
import 'core-js/es/array/flat-map';
import { render, fireEvent, queryByText } from '@testing-library/react';

import { GenericList } from '../GenericList';
import { MESSAGES } from '../constants';

describe('GenericList', () => {
  const defaultNotFoundText = MESSAGES.NOT_FOUND;

  const mockHeaderRenderer = entries => ['Id', 'Name', 'description'];
  const mockEntryRenderer = entry => [entry.id, entry.name, entry.description];

  const mockEntries = [
    { id: '1', name: 'first_entry', description: 'testdescription1' },
    { id: '2', name: 'second_entry', description: 'testdescription2' },
    { id: '3', name: 'THIRD_ENTRY', description: 'testdescription3' },
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
    expect(await getByText(defaultNotFoundText)).toBeInTheDocument();
  });

  it('Renders custom notFoundMessage props', async () => {
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
    expect(await getByText(notFoundMessage)).toBeInTheDocument();
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
    expect(await getByText(title)).toBeInTheDocument();
  });

  describe('Actions', () => {
    it("Renders actions button when 'actions' prop is provided", () => {
      const actions = [{ name: 'testaction', handler: () => {} }];
      const { getAllByLabelText } = render(
        <GenericList
          headerRenderer={() => []}
          rowRenderer={() => []}
          actions={actions}
          entries={mockEntries}
        />,
      );
      const actionButtons = getAllByLabelText(actions[0].name);
      expect(actionButtons.length).toBe(mockEntries.length);
    });

    it("Skips rendering actions when 'actions' prop passes skipAction() call", () => {
      const actions = [
        { name: 'skip it', handler: () => {}, skipAction: () => true },
        {
          name: 'no skipping here',
          handler: () => {},
          skipAction: () => false,
        },
      ];
      const { queryByLabelText } = render(
        <GenericList
          headerRenderer={() => []}
          rowRenderer={() => []}
          actions={actions}
          entries={[{ id: '23' }]}
        />,
      );
      expect(queryByLabelText(actions[0].name)).toBeNull();
      expect(queryByLabelText(actions[1].name)).toBeTruthy();
    });

    it('Renders extra column in header when only actions are set', () => {
      const actions = [{ name: 'testaction', handler: () => {} }];
      const { queryByLabelText, rerender } = render(
        <GenericList
          headerRenderer={() => []}
          rowRenderer={() => []}
          actions={actions}
          entries={mockEntries}
        />,
      );

      expect(queryByLabelText('actions-column')).toBeInTheDocument();

      rerender(
        <GenericList
          headerRenderer={() => []}
          rowRenderer={() => []}
          entries={mockEntries}
        />,
      );

      expect(queryByLabelText('actions-column')).not.toBeInTheDocument();
    });
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
      Object.keys(entry).forEach(key => getByText(entry[key])),
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

    expect(await queryByText(mockEntries[0].name)).toBeInTheDocument();
  });

  it('Renders collapse entries with collapse control', async () => {
    const mockCollapseEntryRenderer = entry => ({
      cells: [entry.id, entry.name, entry.description],
      collapseContent: <td colSpan="4">{entry.name}</td>,
      showCollapseControl: entry.id !== '3',
    });

    const { getByText, getAllByTestId } = render(
      <GenericList
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockCollapseEntryRenderer}
      />,
    );

    mockEntries.forEach(entry =>
      Object.keys(entry).forEach(key => getByText(entry[key])),
    );

    let foundCollapseButtons = await getAllByTestId('collapse-button-close');
    expect(foundCollapseButtons).toHaveLength(2);

    fireEvent.click(foundCollapseButtons[0]);

    foundCollapseButtons = await getAllByTestId('collapse-button-close');
    expect(foundCollapseButtons).toHaveLength(1);
    foundCollapseButtons = await getAllByTestId('collapse-button-open');
    expect(foundCollapseButtons).toHaveLength(1);

    const foundCollapseContents = await getAllByTestId('collapse-content');
    expect(foundCollapseContents).toHaveLength(1);
  });

  it('Renders collapse entries without collapse control', async () => {
    const mockCollapseEntryRenderer = entry => ({
      cells: [entry.id, entry.name, entry.description],
      collapseContent: <td colSpan="4">{entry.name}</td>,
      withCollapseControl: false,
    });

    const { getByText, getAllByTestId, queryAllByTestId } = render(
      <GenericList
        entries={mockEntries}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockCollapseEntryRenderer}
      />,
    );

    let foundCollapseButtons = await queryAllByTestId('collapse-button-close');
    expect(foundCollapseButtons).toHaveLength(0);
    foundCollapseButtons = await queryAllByTestId('collapse-button-open');
    expect(foundCollapseButtons).toHaveLength(0);

    const foundCollapseContents = await getAllByTestId('collapse-content');
    expect(foundCollapseContents).toHaveLength(3);
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

  it("Doesn't render header with showHeader set to false", async () => {
    const { queryAllByRole } = render(
      <GenericList
        entries={[]}
        headerRenderer={mockHeaderRenderer}
        rowRenderer={mockEntryRenderer}
        showHeader={false}
      />,
    );

    const foundRows = queryAllByRole('row');
    expect(foundRows).toHaveLength(1);
    expect(queryByText(foundRows[0], defaultNotFoundText)).toBeInTheDocument();
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

    expect(await getByText(content)).toBeInTheDocument();
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

      expect(await getByRole('search')).toBeInTheDocument();
    });

    it("Doesn't show search field when showSearchField is set to false", async () => {
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
      expect(await queryAllByRole('row')).toHaveLength(mockEntries.length + 1); // header + {mockEntries.length} rows

      const searchInput = await getByLabelText('search-input');
      fireEvent.change(searchInput, { target: { value: searchText } });

      expect(await queryAllByRole('row')).toHaveLength(2); // header + one row
    });

    it('Search is case insensitive', async () => {
      let searchText = 'third';

      const { queryAllByRole, getByLabelText } = render(
        <GenericList
          entries={mockEntries}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
        />,
      );

      expect(await queryAllByRole('row')).toHaveLength(mockEntries.length + 1); // header + {mockEntries.length} rows

      let searchInput = await getByLabelText('search-input');
      fireEvent.change(searchInput, { target: { value: searchText } });

      expect(await queryAllByRole('row')).toHaveLength(2); // header + one row

      searchText = 'THIRD';
      searchInput = await getByLabelText('search-input');
      fireEvent.change(searchInput, { target: { value: searchText } });

      expect(await queryAllByRole('row')).toHaveLength(2); // header + one row
    });

    it('Shows no search result message when there are no results', async () => {
      const searchText = "Do you really can't find it?";
      const noSearchResultMessage = 'Yes, sorry';

      const { queryAllByRole, getByLabelText, getByText } = render(
        <GenericList
          entries={mockEntries}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
          noSearchResultMessage={noSearchResultMessage}
        />,
      );

      expect(await queryAllByRole('row')).toHaveLength(mockEntries.length + 1); // header + {mockEntries.length} rows

      const searchInput = await getByLabelText('search-input');
      fireEvent.change(searchInput, { target: { value: searchText } });

      expect(await queryAllByRole('row')).toHaveLength(2); // header + NoSearchResultMessage dedicated row
      expect(await getByText(noSearchResultMessage)).toBeInTheDocument();
    });

    it('Shows server error message if dataError prop is true', async () => {
      const serverErrorMessage = 'Pico bello';

      const { queryAllByRole, getByText } = render(
        <GenericList
          entries={[]}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
          serverDataError={true}
          serverErrorMessage={serverErrorMessage}
        />,
      );

      expect(await queryAllByRole('row')).toHaveLength(2); // header + ServerErrorMessage dedicated row
      expect(await getByText(serverErrorMessage)).toBeInTheDocument();
    });

    it('Shows Spinner if dataLoading prop is true', async () => {
      const { getByLabelText } = render(
        <GenericList
          entries={[]}
          headerRenderer={mockHeaderRenderer}
          rowRenderer={mockEntryRenderer}
          serverDataLoading={true}
        />,
      );

      expect(await getByLabelText('Loading')).toBeInTheDocument();
    });
  });
});
