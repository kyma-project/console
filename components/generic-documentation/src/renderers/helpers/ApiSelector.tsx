import React, { useState } from 'react';
import { Combobox, List, ListItem } from './styled';
import { Badge } from 'fundamental-react';
import {
  odataDefinition,
  asyncApiDefinition,
  markdownDefinition,
} from '../../constants';
import { Source } from '@kyma-project/documentation-component';

function sortByType(source1: Source, source2: Source): number {
  return (
    source1.type.localeCompare(source2.type) ||
    (source1.data &&
      source2.data &&
      source1.data.displayName.localeCompare(source2.data.displayName)) ||
    source1.rawContent.localeCompare(source2.rawContent)
  );
}

const BadgeForType: React.FunctionComponent<{ type: string }> = ({ type }) => {
  let badgeType: 'success' | 'warning' | 'error' | undefined;

  if (odataDefinition.possibleTypes.includes(type)) {
    badgeType = 'warning';
  }

  if (asyncApiDefinition.possibleTypes.includes(type)) {
    badgeType = 'success';
  }

  if (markdownDefinition.possibleTypes.includes(type)) {
    badgeType = 'error';
  }

  return <Badge type={badgeType}>{type}</Badge>;
};

const ApiSelector: React.FunctionComponent<{
  sources: Source[];
  onApiSelect: (api: Source) => void;
  selectedApi: Source;
}> = ({ sources, onApiSelect, selectedApi }) => {
  const [searchText, setSearchText] = useState('');
  const sortedSources = sources
    .filter((s: Source) => s.type.includes(searchText))
    .sort(sortByType);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  return (
    <Combobox
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        const a = e.target as HTMLElement; // not sure why but it's needed, thank you typescript!
        if (a.tagName === 'INPUT' || a.tagName === 'BUTTON') {
          e.stopPropagation(); // avoid closing the dropdown due to the "opening" click ∞
        }
      }}
      menu={
        <List>
          {sortedSources.map((s: Source, id) => (
            <a
              aria-label="api-"
              href="#"
              onClick={e => onApiSelect(s)}
              className="fd-menu__item"
              key={s.rawContent}
            >
              <ListItem>
                <BadgeForType type={s.type} />
                {s.data && s.data.displayName} {id}
              </ListItem>
            </a>
          ))}
        </List>
      }
      placeholder={
        (selectedApi && selectedApi.data && selectedApi.data.displayName) ||
        'Select API'
      }
      inputProps={{ onChange: handleInputChange }}
    />
  );
};

export default ApiSelector;
