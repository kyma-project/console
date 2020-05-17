import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Tabs } from '../Tabs';
import { Tab } from '../Tab';

describe('Tabs', () => {
  it('Renders basic component', () => {
    const { queryByRole, queryAllByRole, getByRole } = render(
      <Tabs>
        <Tab title="tab title 1">
          <p>tab content 1</p>
        </Tab>
        <Tab title="tab title 2">
          <p>tab content 2</p>
        </Tab>
      </Tabs>,
    );

    expect(queryByRole('tablist')).toBeInTheDocument();
    expect(queryAllByRole('tab')).toHaveLength(2);

    const tabContent = getByRole('tabpanel');
    expect(tabContent.textContent).toBe('tab content 1');
  });

  it('Selects custom default tab', () => {
    const { getByRole } = render(
      <Tabs defaultActiveTabIndex={1}>
        <Tab title="tab title 1">
          <p>tab content 1</p>
        </Tab>
        <Tab title="tab title 2">
          <p>tab content 2</p>
        </Tab>
      </Tabs>,
    );
    const tabContent = getByRole('tabpanel');
    expect(tabContent.textContent).toBe('tab content 2');
  });

  it('Switches between tabs', () => {
    const { getByRole, getAllByRole } = render(
      <Tabs>
        <Tab title="tab title 1">
          <p>tab content 1</p>
        </Tab>
        <Tab title="tab title 2">
          <p>tab content 2</p>
        </Tab>
      </Tabs>,
    );

    const tabs = getAllByRole('tab');

    // initially first tab
    expect(getByRole('tabpanel').textContent).toBe('tab content 1');

    // select second tab
    fireEvent.click(tabs[1]);
    expect(getByRole('tabpanel').textContent).toBe('tab content 2');

    // select first tab
    fireEvent.click(tabs[0]);
    expect(getByRole('tabpanel').textContent).toBe('tab content 1');
  });

  it('Fires custom callback on tab change', () => {
    const callback = jest.fn();
    const { queryAllByRole } = render(
      <Tabs callback={callback}>
        <Tab title="tab title 1">
          <p>tab content 1</p>
        </Tab>
        <Tab title="tab title 2">
          <p>tab content 2</p>
        </Tab>
      </Tabs>,
    );

    fireEvent.click(queryAllByRole('tab')[1]);
    expect(callback).toHaveBeenCalledWith(1);
  });
});
