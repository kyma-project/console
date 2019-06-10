import React from 'react';

export const img = {
  shouldProcessNode: node => node.type === 'tag' && node.name === 'img',
  processNode: node => {
    return <img {...node.attribs} />;
  },
};
