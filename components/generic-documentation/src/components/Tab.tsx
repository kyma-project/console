import React from 'react';
import { createElementClass, createModifierClass } from '../helpers';

export interface TabProps {
  children: React.ReactNode;
  label: React.ReactNode;
  tabIndex?: number;
  isActive?: boolean;
  parentCallback?: (value: number) => void;
}

export const Tab: React.FunctionComponent<TabProps> = ({
  label = '',
  tabIndex,
  isActive = false,
  parentCallback,
}) => (
  <li
    className={`${createElementClass('tab')} ${
      isActive ? createModifierClass('active', 'tab') : ''
    }`}
    key={tabIndex}
  >
    <div
      className={createElementClass('tab-label')}
      onClick={(event: any) => {
        event.preventDefault();
        if (parentCallback) {
          parentCallback(tabIndex ? tabIndex : 0);
        }
      }}
    >
      {label}
    </div>
  </li>
);
