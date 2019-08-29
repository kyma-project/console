import React from 'react';
import { Icon } from 'fundamental-react';
import './InProgressMessage.scss';

const InProgressMessage = () => (
  <section className="container">
    <Icon className="rotating-icon" glyph="action-settings" size="xl" />
    <h1>This part is currently in progress</h1>
  </section>
);
export default InProgressMessage;
