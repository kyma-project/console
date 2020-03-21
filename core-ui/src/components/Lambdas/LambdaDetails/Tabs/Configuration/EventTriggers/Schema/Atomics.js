import React from 'react';

import { bemClasses } from '../../../../../helpers/misc';

const classes = {
  markdown: bemClasses.element(`markdown`),
  treeSpace: bemClasses.element(`tree-space`),
  treeLeaf: bemClasses.element(`tree-leaf`),
};

export const Markdown = ({ children }) => (
  <div className={classes.markdown}>{children}</div>
);

export const TreeSpace = () => <span className={classes.treeSpace} />;

export const TreeLeaf = () => <span className={classes.treeLeaf} />;
