import React from 'react';
import CreateRuntimeForm from './CreateRuntimeForm/CreateRuntimeForm';
import RuntimeList from './RuntimeList/RuntimeList';
const Runtimes = () => {
  return (
    <section className="fd-section">
      <h1>Runtimes</h1>
      <RuntimeList />
    </section>
  );
};

export default Runtimes;
