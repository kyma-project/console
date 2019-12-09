import React from 'react';
import ListActions from '../ListActions';

import 'core-js/es/array/flat-map';
import { render } from '@testing-library/react';

describe('ListActions', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation();

  it('Renders only standalone buttons', () => {
    const entry = { id: '123' };
    const actions = [
      { name: 'action1', handler: jest.fn() },
      { name: 'action2', handler: jest.fn() },
    ];
    const { queryByLabelText, queryAllByRole } = render(
      <ListActions actions={actions} entry={entry} />,
    );

    expect(queryByLabelText('more-actions')).toBeFalsy();
    expect(queryAllByRole('button')).toHaveLength(2);

    actions.forEach(action => {
      const actionButton = queryByLabelText(action.name);
      expect(actionButton).toBeTruthy();

      actionButton.click();

      expect(action.handler).toHaveBeenCalledWith(entry);
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('Renders only dropdown actions', () => {
    const entry = { id: '123' };
    const actions = [
      { name: 'action1', handler: jest.fn() },
      { name: 'action2', handler: jest.fn() },
    ];
    const { queryByText, queryByLabelText } = render(
      <ListActions actions={actions} entry={entry} standaloneItems={0} />,
    );

    const moreActionsButton = queryByLabelText('more-actions');
    expect(moreActionsButton).toBeInTheDocument();

    actions.forEach(action => {
      expect(queryByText(action.name)).not.toBeInTheDocument();
    });

    moreActionsButton.click();

    actions.forEach(action => {
      const actionButton = queryByText(action.name);
      expect(actionButton).toBeTruthy();

      actionButton.click();

      expect(action.handler).toHaveBeenCalledWith(entry);
    });

    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  it('Renders mixed actions', () => {
    const actions = [
      { name: 'action1', handler: jest.fn() },
      { name: 'action2', handler: jest.fn() },
    ];
    const { queryByText, queryByLabelText } = render(
      <ListActions actions={actions} entry={{}} standaloneItems={1} />,
    );

    const moreActionsButton = queryByLabelText('more-actions');
    expect(moreActionsButton).toBeInTheDocument();
    expect(queryByText(actions[0].name)).toBeInTheDocument();
    expect(queryByText(actions[1].name)).not.toBeInTheDocument();

    moreActionsButton.click();

    expect(queryByText(actions[1].name)).toBeInTheDocument();

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('Renders icon for standalone button', () => {
    const actions = [{ name: 'action', handler: jest.fn(), icon: 'edit' }];
    const { queryByText, queryByLabelText } = render(
      <ListActions actions={actions} entry={{}} />,
    );

    const actionButton = queryByLabelText(actions[0].name);
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveClass('sap-icon--edit');

    expect(queryByText(actions[0].name)).not.toBeInTheDocument();

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("Doesn't render icon for dropdown button", () => {
    const actions = [{ name: 'action', handler: jest.fn(), icon: 'edit' }];
    const { getByLabelText, queryByText, queryByLabelText } = render(
      <ListActions actions={actions} entry={{}} standaloneItems={0} />,
    );

    getByLabelText('more-actions').click();

    const actionButton = queryByText(actions[0].name);
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).not.toHaveClass('sap-icon--edit');

    expect(queryByLabelText(actions[0].name)).not.toBeInTheDocument();

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('Renders predefined icons', () => {
    const actions = [
      { name: 'Edit', handler: jest.fn() },
      { name: 'Delete', handler: jest.fn() },
    ];
    const { getByLabelText } = render(
      <ListActions actions={actions} entry={{}} />,
    );

    const editButton = getByLabelText('Edit');
    expect(editButton).toHaveClass('sap-icon--edit');

    const deleteButton = getByLabelText('Delete');
    expect(deleteButton).toHaveClass('sap-icon--delete');

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('Can override predefined icons', () => {
    const actions = [
      { name: 'Edit', handler: jest.fn(), icon: 'add' },
      { name: 'Delete', handler: jest.fn(), icon: 'minus' },
    ];
    const { getByLabelText } = render(
      <ListActions actions={actions} entry={{}} />,
    );

    const editButton = getByLabelText('Edit');
    expect(editButton).not.toHaveClass('sap-icon--edit');
    expect(editButton).toHaveClass('sap-icon--add');

    const deleteButton = getByLabelText('Delete');
    expect(deleteButton).not.toHaveClass('sap-icon--delete');
    expect(deleteButton).toHaveClass('sap-icon--minus');

    expect(consoleError).not.toHaveBeenCalled();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
});
