import React, { useState, useEffect, useMemo } from 'react';
import { createElementClass, toKebabCase } from '@kyma-project/common';

import { TabProps } from './Tab';

type Labels = {
  [id: string]: number;
};

const serializeTabs = (
  children: Array<React.ReactElement<TabProps>>,
): Array<React.ReactElement<TabProps>> => {
  return React.Children.map(children, child => {
    return (
      child &&
      React.cloneElement(child, {
        ...child.props,
        id: toKebabCase(child.props.id),
      })
    );
  });
};

const createLabelsIndex = (
  children: Array<React.ReactElement<TabProps>>,
): Labels => {
  const labels: Labels = {};
  React.Children.map(children, (child, index) => {
    if (child) {
      labels[child.props.id] = index;
    }
  });
  return labels;
};

export interface TabsProps {
  className?: string;
  active?: string;
  onInit?: () => string | undefined;
  onChangeTab?: {
    func: (label: string) => void;
    preventDefault?: boolean;
  };
}

export const Tabs: React.FunctionComponent<TabsProps> = ({
  className = '',
  active,
  onInit,
  onChangeTab,
  children: c,
}) => {
  const children: Array<React.ReactElement<TabProps>> = useMemo(
    () =>
      serializeTabs(c as Array<React.ReactElement<TabProps>>).filter(
        child => child,
      ),
    [],
  );

  const labels: Labels = useMemo(() => createLabelsIndex(children), []);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    let id = onInit && onInit();
    if (!id || !Object.keys(labels).includes(id)) {
      id = active || Object.keys(labels)[0] || '';
    }
    setActiveTab(toKebabCase(id));
  }, []);

  if (!children) {
    return null;
  }

  const handleTabClick = (id: string) => {
    if (onChangeTab) {
      const { func, preventDefault } = onChangeTab;

      func(id);
      if (preventDefault) {
        return;
      }
    }
    setActiveTab(id);
  };

  const renderHeader = (ch: Array<React.ReactElement<TabProps>>) =>
    React.Children.map(ch, (child, index) => {
      const c = child as React.ReactElement<TabProps>;
      return React.cloneElement(c, {
        key: index,
        label: c.props.label,
        id: c.props.id,
        parentCallback: handleTabClick,
        tabIndex: index,
        isActive: c.props.id === activeTab,
      });
    });

  const renderActiveTab = (ch: Array<React.ReactElement<TabProps>>) =>
    ch[labels[activeTab]] ? ch[labels[activeTab]].props.children : null;

  return (
    <div className={`${createElementClass('tabs')} ${className}`}>
      <ul className={createElementClass('tabs-header')}>
        {renderHeader(children)}
      </ul>
      <div className={createElementClass('tabs-content')}>
        {renderActiveTab(children)}
      </div>
    </div>
  );
};
