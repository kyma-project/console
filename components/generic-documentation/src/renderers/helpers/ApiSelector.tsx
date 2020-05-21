import React, { useState } from 'react';
import { Combobox, List, ListItem } from './styled';
import { Badge } from 'fundamental-react';
import {
  odataDefinition,
  asyncApiDefinition,
  markdownDefinition,
} from '../../constants';
import { Source } from '@kyma-project/documentation-component';

function getApiNameLength(s: Source) {
  return s.data && s.data.displayName ? s.data.displayName.length : 0;
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

  const filteredSources = sources.filter(
    (s: Source) =>
      (s.data &&
        s.data.displayName &&
        s.data.displayName.toUpperCase().includes(searchText.toUpperCase())) ||
      s.type.includes(searchText),
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  const maxApiNameLength = filteredSources.length
    ? getApiNameLength(
        filteredSources.reduce((prev, current) =>
          getApiNameLength(current) > getApiNameLength(prev) ? current : prev,
        ),
      )
    : 0;

  return (
    <Combobox
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        const a = e.target as HTMLElement; // not sure why but it's needed, thank you typescript!
        if (a.tagName === 'INPUT' || a.tagName === 'BUTTON') {
          e.stopPropagation(); // avoid closing the dropdown due to the "opening" click ∞
        }
      }}
      data-max-list-chars={maxApiNameLength}
      menu={
        <List>
          {filteredSources.map((s: Source, id) => (
            <a
              aria-label="api-"
              href="#"
              onClick={e => onApiSelect(s)}
              className="fd-menu__item"
              key={(s.data && s.data.displayName) || s.rawContent}
            >
              <ListItem>
                <BadgeForType type={s.type} />
                {s.data && s.data.displayName}
              </ListItem>
            </a>
          ))}
        </List>
      }
      placeholder={
        (selectedApi && selectedApi.data && selectedApi.data.displayName) ||
        (selectedApi && selectedApi.type) ||
        'Select API'
      }
      inputProps={{ onChange: handleInputChange }}
    />
  );
};

export default ApiSelector;
