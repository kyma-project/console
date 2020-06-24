import Cards from '../Cards.component';

import React from 'react';
import { shallow } from 'enzyme';
import Card from '../Card.component';
import {
  mockServiceClass,
  mockPlan,
} from 'testing/catalog/serviceClassesMocks';
import { DOCUMENTATION_PER_PLAN_LABEL } from 'helpers/constants';

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
}));

const mock = [
  {
    name: 'name1',
    displayName: 'displayName1',
    externalName: 'externalName1',
    providerDisplayName: 'turururu1',
    description: 'This is awsome1',
    imageUrl: 'https://example.com/1',
    instances: ['a', 'b'],
    labels: {
      local: 'true',
      sth: 'one',
    },
  },
  {
    name: 'name2',
    displayName: '',
    externalName: 'externalName2',
    providerDisplayName: 'turururu2',
    description: 'This is awsome2',
    imageUrl: 'https://example.com/2',
    instances: ['a'],
    labels: {
      local: 'true',
      sth: 'two',
    },
  },
  {
    name: 'name3',
    displayName: '',
    externalName: '',
    providerDisplayName: 'turururu3',
    description: 'This is awsome3',
    imageUrl: 'https://example.com/3',
    instances: [],
    labels: {},
  },
];

const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
});

describe('Cards.component', () => {
  const component = shallow(<Cards items={mock} />);
  const cards = component.find(Card);

  afterEach(() => {
    mockNavigate.mockReset();
  });

  it('Renders proper number of cards', () => {
    expect(cards).toHaveLength(3);
  });

  it('Renders first card correctly', () => {
    expect(cards.at(0).prop('title')).toEqual(mock[0].displayName);
    expect(cards.at(0).prop('company')).toEqual(mock[0].providerDisplayName);
    expect(cards.at(0).prop('description')).toEqual(mock[0].description);
    expect(cards.at(0).prop('imageUrl')).toEqual(mock[0].imageUrl);
    expect(cards.at(0).prop('labels')).toEqual(mock[0].labels);

    expect(cards.at(0).prop('numberOfInstances')).toEqual(
      mock[0].instances.length,
    );
  });

  it('Renders second card correctly', () => {
    expect(cards.at(1).prop('title')).toEqual(mock[1].externalName);
    expect(cards.at(1).prop('company')).toEqual(mock[1].providerDisplayName);
    expect(cards.at(1).prop('description')).toEqual(mock[1].description);
    expect(cards.at(1).prop('imageUrl')).toEqual(mock[1].imageUrl);
    expect(cards.at(1).prop('labels')).toEqual(mock[1].labels);
    expect(cards.at(1).prop('numberOfInstances')).toEqual(
      mock[1].instances.length,
    );
  });

  it('Renders third card correctly', () => {
    expect(cards.at(2).prop('title')).toEqual(mock[2].name);
    expect(cards.at(2).prop('company')).toEqual(mock[2].providerDisplayName);
    expect(cards.at(2).prop('description')).toEqual(mock[2].description);
    expect(cards.at(2).prop('imageUrl')).toEqual(mock[2].imageUrl);
    expect(cards.at(2).prop('labels')).toEqual(mock[2].labels);
    expect(cards.at(2).prop('numberOfInstances')).toEqual(
      mock[2].instances.length,
    );
  });

  it('clicking triggers onClick for non-APIpackage', () => {
    const component = shallow(<Cards items={mock} />);
    const card = component.find(Card).at(0);
    expect(card.exists()).toBe(true);
    card.prop('onClick')();
    expect(mockNavigate).toHaveBeenCalledWith(`details/${mock[0].name}`);
  });

  it('clicking triggers onClick for APIpackage with one plan', () => {
    const mockService = {
      ...mockServiceClass(1, false, [mockPlan(1)]),
      labels: { [DOCUMENTATION_PER_PLAN_LABEL]: 'true' },
    };
    const component = shallow(<Cards items={[mockService]} />);
    const card = component.find(Card).at(0);
    expect(card.exists()).toBe(true);
    card.prop('onClick')();
    expect(mockNavigate).toHaveBeenCalledWith(
      `details/${mockService.name}/plan/${mockPlan(1).name}`,
    );
  });

  it('clicking triggers onClick for APIpackage with many plans', () => {
    const mockService = {
      ...mockServiceClass(1, false, [mockPlan(1), mockPlan(2)]),
      labels: { [DOCUMENTATION_PER_PLAN_LABEL]: 'true' },
    };
    const component = shallow(<Cards items={[mockService]} />);
    const card = component.find(Card).at(0);
    expect(card.exists()).toBe(true);
    card.prop('onClick')();
    expect(mockNavigate).toHaveBeenCalledWith(
      `details/${mockService.name}/plans`,
    );
  });
});
