import React from 'react';

import Tabs from '../../Tabs';
import Tab from '../../Tabs/Tab';
import ReactMarkdown from '../index';

let tabsCounter = 0;
const blockquoteRegex = /(^( *>).*?\n)/gm;
const orderedListRegex = /^( *[0-9])+.(.*)/gm;

export const tabs = {
  replaceChildren: true,
  shouldProcessNode: node =>
    node.type === 'tag' &&
    node.name === 'div' &&
    node.attribs &&
    node.attribs.hasOwnProperty('tabs'),
  processNode: node => {
    const children = node.children.map(child => {
      if (child.type === 'tag' && child.name === 'details' && child.children) {
        return child.children.map(childDetails => {
          if (
            !(childDetails.type === 'tag' &&
            childDetails.name === 'summary' &&
            childDetails.children.length === 1 &&
            childDetails.children[0].type === 'text' &&
            childDetails.next.data)
          ) { 
            return null;
          }
          
          const summary = childDetails.children[0].data;
          const tabData = childDetails.next.data
            .replace(blockquoteRegex, blockquote => `${blockquote}\n`)
            .replace(orderedListRegex, listElement => `\n${listElement}\n`);

          return (
            <Tab
              key={summary.toLowerCase().replace(' ', '-')}
              title={summary}
              smallPadding={true}
            >
              <ReactMarkdown source={tabData} />
            </Tab>
          );
        });
      }
    });

    return [
      <Tabs key={tabsCounter++} border={true}>
        {children}
      </Tabs>,
    ];
  },
};
