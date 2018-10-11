import React from 'react';
import Grid from 'styled-components-grid';

import { InformationModal } from '@kyma-project/react-components';

import { List, Item, Bold } from './styled';

const ParametersDataModal = ({ title, data, modalOpeningComponent }) => {
  const populateItems = data => {
    return Object.entries(data).map(([key, value]) => (
      <Grid key={key}>
        <Grid.Unit size={0.25}>
          <Item>
            <Bold>{key}</Bold>
          </Item>
        </Grid.Unit>
        <Grid.Unit size={0.75}>
          <Item>{value}</Item>
        </Grid.Unit>
      </Grid>
    ));
  };

  const items = populateItems(data);
  const content = <List>{items}</List>;

  return (
    <InformationModal
      title={title}
      content={content}
      modalOpeningComponent={modalOpeningComponent}
    />
  );
};

export default ParametersDataModal;
