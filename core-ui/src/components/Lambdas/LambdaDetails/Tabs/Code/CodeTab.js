import React from 'react';

import CodeAndDependencies from './CodeAndDependencies/CodeAndDependencies';

export default function CodeTab({ lambda }) {
  return (
    <>
      <CodeAndDependencies lambda={lambda} />
    </>
  );
}
