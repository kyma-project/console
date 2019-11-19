import Cards from '../Cards.component';

import React from 'react';
import { shallow } from 'enzyme';
import Card from '../Card.component';

const mockNavigate = jest.fn();
jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: function() {
      return {
        fromClosestContext: function() {
          return {
            navigate: mockNavigate,
          };
        },
      };
    },
  };
});

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
    labels: {
      local: 'true',
      sth: 'three',
    },
  },
];
describe('Cards.component', () => {
  it('Renders correctly', () => {
    const component = shallow(<Cards items={mock} />);
    const cards = component.find(Card);
    expect(cards).toHaveLength(3);

    expect(cards.at(0).prop('title')).toEqual(mock[0].displayName);
    expect(cards.at(0).prop('company')).toEqual(mock[0].providerDisplayName);
    expect(cards.at(0).prop('description')).toEqual(mock[0].description);
    expect(cards.at(0).prop('imageUrl')).toEqual(mock[0].imageUrl);
    expect(cards.at(0).prop('labels')).toEqual(mock[0].labels);
    expect(cards.at(0).prop('numberOfInstances')).toEqual(
      mock[0].instances.length,
    );

    expect(cards.at(1).prop('title')).toEqual(mock[1].externalName);
    expect(cards.at(1).prop('company')).toEqual(mock[1].providerDisplayName);
    expect(cards.at(1).prop('description')).toEqual(mock[1].description);
    expect(cards.at(1).prop('imageUrl')).toEqual(mock[1].imageUrl);
    expect(cards.at(1).prop('labels')).toEqual(mock[1].labels);
    expect(cards.at(1).prop('numberOfInstances')).toEqual(
      mock[1].instances.length,
    );

    expect(cards.at(2).prop('title')).toEqual(mock[2].name);
    expect(cards.at(2).prop('company')).toEqual(mock[2].providerDisplayName);
    expect(cards.at(2).prop('description')).toEqual(mock[2].description);
    expect(cards.at(2).prop('imageUrl')).toEqual(mock[2].imageUrl);
    expect(cards.at(2).prop('labels')).toEqual(mock[2].labels);
    expect(cards.at(2).prop('numberOfInstances')).toEqual(
      mock[2].instances.length,
    );
  });

  it('clicking triggers onClick ', () => {
    const component = shallow(<Cards items={[mock[0]]} />);
    const card = component.find(Card);
    expect(card.exists()).toBe(true);
    card.simulate('click');
    expect(mockNavigate).toHaveBeenCalledWith(`details/${mock[0].name}`);
  });
});
