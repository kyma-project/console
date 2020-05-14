import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { Icon } from 'fundamental-react';

import Card from '../Card.component';
import { InstancesIndicator } from '../InstancesIndicator';
import { Labels } from '../Labels';
import { CardImage, CardContent } from '../styled';
import { DOCUMENTATION_PER_PLAN_LABEL } from 'helpers/constants';

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

const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
});

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
      const field = component.find('div[data-e2e-id="card-title"] h3');
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

    it('has labels', () => {
      const labels = component.find(Labels);
      expect(labels.exists()).toBe(true);
      expect(labels.prop('labels')).toBe(mock.labels);
    });

    it('has instances indicator', () => {
      const indicator = component.find(InstancesIndicator);
      expect(indicator.exists()).toBe(true);
      expect(indicator.prop('numberOfInstances')).toBe(mock.numberOfInstances);
      expect(indicator.prop('labels')).toBe(mock.labels);
    });

    it('clicking triggers onClick', () => {
      const link = component.find(CardContent);
      expect(link.exists()).toBe(true);
      link.simulate('click');
      expect(onCLick).toHaveBeenCalled();
    });
  });

  it('Render card without imageUrl', () => {
    const onCLick = jest.fn();
    const component = mount(
      <Card
        title={mock.title}
        company={mock.company}
        description={mock.description}
        imageUrl={''}
        numberOfInstances={mock.numberOfInstances}
        labels={mock.labels}
        onClick={onCLick}
      />,
    );

    const image = component.find(CardImage);
    expect(image.exists()).toBe(false);

    const placeholder = component.find(Icon);
    expect(placeholder.exists()).toBe(true);
  });

  it("Doesn't render API package icon when label is not set", () => {
    const onCLick = jest.fn();
    const { queryByLabelText } = render(<Card {...mock} onClick={onCLick} />);

    expect(
      queryByLabelText('has-API-packages-indicator'),
    ).not.toBeInTheDocument();
  });

  it('Renders API package icon when label is set', () => {
    const onCLick = jest.fn();
    const { queryByLabelText } = render(
      <Card
        {...mock}
        labels={{ [DOCUMENTATION_PER_PLAN_LABEL]: 'true' }}
        onClick={onCLick}
      />,
    );

    expect(queryByLabelText('has-API-packages-indicator')).toBeInTheDocument();
  });
});
