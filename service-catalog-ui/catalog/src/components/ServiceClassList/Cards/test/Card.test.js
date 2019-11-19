import React from 'react';
import { mount } from 'enzyme';
import Card from '../Card.component';

import { CardImage, CardHeaderContent } from '../styled';
import { InstancesIndicator } from '../InstancesIndicator';
import { Labels } from '../Labels';
const mock = {
  title: 'Some title',
  company: 'turururu',
  description: 'This is awsome',
  imageUrl: 'https://example.com',
  numberOfInstances: 1,
  labels: {
    local: 'true',
    sth: 'ping',
  },
};
describe('Card.component', () => {
  describe('Render card with full data', () => {
    const onCLick = jest.fn();
    const component = mount(
      <Card
        title={mock.title}
        company={mock.company}
        description={mock.description}
        imageUrl={mock.imageUrl}
        numberOfInstances={mock.numberOfInstances}
        labels={mock.labels}
        onClick={onCLick}
      />,
    );

    it('has title', () => {
      const field = component.find('div[data-e2e-id="card-title"] h2');
      expect(field.exists()).toBe(true);
      expect(field.text()).toEqual(mock.title);
    });

    it('has company', () => {
      const field = component.find('span[data-e2e-id="card-company"]');
      expect(field.exists()).toBe(true);
      expect(field.text()).toEqual(mock.company);
    });

    it('has image thumbnail', () => {
      const image = component.find(CardImage).find('span');
      expect(image.exists()).toBe(true);
      expect(image.prop('style')).toHaveProperty(
        'backgroundImage',
        `url(${mock.imageUrl})`,
      );
    });

    test.todo('has labels');
    test.todo('has instances indicator');
    test.todo('clicking triggers onClick');
  });

  it('Render card without imageUrl', () => {});
});
