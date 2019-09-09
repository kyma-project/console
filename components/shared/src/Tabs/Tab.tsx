import React from 'react';
import { createElementClass, createModifierClass } from '@kyma-project/common';

export interface TabProps {
  label: React.ReactNode;
  id: string;
  tabIndex?: number;
  isActive?: boolean;
  parentCallback?: (value: string) => void;
  children: React.ReactNode;
}

export const Tab: React.FunctionComponent<TabProps> = ({
  label,
  id,
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
          parentCallback(id);
        }
      }}
    >
      {label}
    </div>
  </li>
);
