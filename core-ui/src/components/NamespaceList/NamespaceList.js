import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useQuery } from '@apollo/react-hooks';

import { GET_NAMESPACES } from '../../gql/queries';
import { NAMESPACES_EVENT_SUBSCRIPTION } from '../../gql/subscriptions';

import { Spinner } from 'react-shared';
import NamespacesGrid from './NamespacesGrid/NamespacesGrid';
import NamespacesListHeader from './NamespacesListHeader/NamespacesListHeader';
import * as storage from './storage';
import { handleNamespaceWsEvent } from './wsHandler';
import { useMicrofrontendContext, useSideDrawer } from 'react-shared';
import { ControlledEditor } from '@monaco-editor/react';
import { Button } from 'fundamental-react';

function sortByName(array) {
  array.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

const Content1 = _ => (
  <>
    <h1>Here's your shitty code</h1>
    <ControlledEditor
      height="50em"
      width="50em"
      language={'javascript'}
      theme="vs-light"
      value={`      
request.get_something = (something_id) => {
  return new Promise((resolve, reject) => {
    database.find_all('something', { where: {something_id: something_id, is_deleted:0} }).then(function(res){
      let result = {};
      res = JSON.stringify(res);
      res = JSON.parse(res);
      res.forEach(function(element){
        if(typeof element.is_deleted != "undefined"){
          delete element.is_deleted;
        }
        let key = 'something_' + element.id;
        result[key] = element;
      });
      resolve(result);
    }, reject);
  });
}
          
          `}
    />
  </>
);

const Content2 = _ => (
  <>
    <h1>Here's your sexy code</h1>
    <ControlledEditor
      height="50em"
      width="50em"
      language={'javascript'}
      theme="vs-light"
      value={`
function hasselhoff(sunnyWeather=true){
  return "He's so handsome";
} 
          `}
    />
  </>
);

export default function NamespaceList() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [labelFilters, setLabelFilters] = useState([]);
  const { showSystemNamespaces } = useMicrofrontendContext();
  const [drawer, setDrawerContent] = useSideDrawer(
    null,
    <Button option="emphasized">Save it (please don't)</Button>,
  );

  const createFilters = namespaces => {
    const storedFilterLabels = storage.readStoredFilterLabels();

    // convert multi-keyed objects to one-keyed objects
    const labels = namespaces
      .flatMap(n => n.labels)
      .filter(Boolean)
      .flatMap(label => Object.keys(label).map(key => ({ [key]: label[key] })));

    // group labels by key and value
    const filtersArray = [];
    labels.forEach(label => {
      const key = Object.keys(label)[0];
      const value = label[key];

      const existingElement = filtersArray.filter(
        e => e.key === key && e.value === value,
      );

      if (!existingElement[0]) {
        filtersArray.push({
          key,
          value,
          count: 1,
        });
      } else {
        existingElement[0].count++;
      }
    });
    const filters = filtersArray.map(({ key, value, count }) => {
      const label = { [key]: value };
      return {
        label: label,
        name: `${key}=${value} (${count})`,
        isSelected: storedFilterLabels.some(f => _.isEqual(f, label)),
      };
    });
    sortByName(filters);
    return filters;
  };

  const filterNamespace = namespace => {
    if (namespace.name.indexOf(searchPhrase) === -1) {
      return false;
    }

    const activeLabelFilters = labelFilters
      .filter(f => f.isSelected)
      .map(f => f.label);

    if (!activeLabelFilters.length) {
      return true;
    }

    if (!namespace.labels && activeLabelFilters.length) {
      return false;
    }

    // eslint-disable-next-line
    for (const filterLabel of activeLabelFilters) {
      const labelKey = Object.keys(filterLabel)[0];
      if (
        labelKey in namespace.labels &&
        namespace.labels[labelKey] === filterLabel[labelKey]
      ) {
        return true;
      }
    }
    return false;
  };

  const updateLabelFilters = filters => {
    const filterLabels = filters.filter(f => f.isSelected).map(f => f.label);
    storage.saveStoredFilterLabels(filterLabels);

    setLabelFilters(createFilters(namespaces));
  };

  const { data, error, loading, subscribeToMore } = useQuery(GET_NAMESPACES, {
    variables: {
      showSystemNamespaces,
      withInactiveStatus: true,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    return subscribeToMore({
      variables: {
        showSystemNamespaces,
        withInactiveStatus: true,
      },
      document: NAMESPACES_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !subscriptionData.data.namespaceEvent) {
          //needed?
          return prev;
        }

        const namespaceEvent = subscriptionData.data.namespaceEvent;

        return handleNamespaceWsEvent(namespaceEvent, prev);
      },
    });
  }, [subscribeToMore, showSystemNamespaces]);

  useEffect(() => {
    if (data && data.namespaces) {
      setLabelFilters(createFilters(data.namespaces));
    }
  }, [data]);

  if (error) return `Error! ${error.message}`;

  if (loading) return <Spinner />;

  const namespaces = data.namespaces;
  sortByName(namespaces);

  return (
    <>
      {drawer}
      <NamespacesListHeader
        updateSearchPhrase={searchPhrase => setSearchPhrase(searchPhrase)}
        setLabelFilters={updateLabelFilters}
        labelFilters={labelFilters}
      />
      <Button onClick={_ => setDrawerContent(Content1)}>
        expand content 1
      </Button>
      <NamespacesGrid namespaces={namespaces.filter(filterNamespace)} />
      <Button onClick={_ => setDrawerContent(Content2)}>
        expand content 2
      </Button>
      <Button onClick={_ => setDrawerContent(Content1)}>
        expand content 1 (yes it does the same)
      </Button>
    </>
  );
}
