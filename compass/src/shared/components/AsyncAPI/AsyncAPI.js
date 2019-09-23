import React from 'react';
import AsyncAPI from '@kyma-project/asyncapi-react';

import './AsyncAPI.scss';

function AsyncAPIComponent({ schema }) {
  return (
    <section className="asyncapi-wrapper">
      <AsyncAPI schema={schema} />
    </section>
  );
}

export default AsyncAPIComponent;
