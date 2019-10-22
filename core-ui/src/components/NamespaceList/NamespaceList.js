import React from 'react';
import _ from 'lodash';
import { useQuery } from '@apollo/react-hooks';

import Spinner from '../../shared/components/Spinner/Spinner';
import { GET_NAMESPACES } from '../../gql/queries';
import { POLL_INTERVAL } from './../../shared/constants';
import NamespacesGrid from './NamespacesGrid/NamespacesGrid';
import NamespacesListHeader from './NamespacesListHeader/NamespacesListHeader';
import * as storage from './storage';

function sortByName(array) {
  array.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

export default function NamespaceList() {
  const [searchPhrase, setSearchPhrase] = React.useState('');
  const [labelFilters, setLabelFilters] = React.useState([]);

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

  const { data, error, loading } = useQuery(GET_NAMESPACES, {
    variables: {
      showSystemNamespaces: storage.shouldShowSystemNamespaces(),
      withInactiveStatus: true,
    },
    pollInterval: POLL_INTERVAL,
  });

  React.useEffect(() => {
    if (data && data.namespaces) {
      setLabelFilters(createFilters(data.namespaces));
    }
  }, [data]);

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  const namespaces = data.namespaces;
  sortByName(namespaces);

  return (
    <>
      <NamespacesListHeader
        updateSearchPhrase={searchPhrase => setSearchPhrase(searchPhrase)}
        setLabelFilters={updateLabelFilters}
        labelFilters={labelFilters}
      />
      <NamespacesGrid namespaces={namespaces.filter(filterNamespace)} />
    </>
  );
}
