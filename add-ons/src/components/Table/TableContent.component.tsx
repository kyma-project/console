import React from 'react';
import { TreeView, InlineHelp } from 'fundamental-react';

import DeleteConfigurationModal from '../Modals/DeleteConfigurationModal/DeleteConfigurationModal.container';
import AddUrlModal from '../Modals/AddUrlModal/AddUrlModal.container';
import DeleteUrlModal from '../Modals/DeleteUrlModal/DeleteUrlModal.container';

import {
  Label,
  Labels,
  TreeViewColActions,
  NoAvailableLabelsText,
} from './styled';

import { Configuration, ConfigurationLabels } from '../../types';
import {
  DEFAULT_CONFIGURATION,
  DEFAULT_CONFIGURATION_DESCRIPTION,
  NO_LABELS_AVAILABLE,
} from '../../constants';

interface TableContentProps {
  headers: string[];
  configs: Configuration[];
  setFilterLabel: (key: string, value: string) => void;
}

const TableContentComponent: React.FunctionComponent<TableContentProps> = ({
  headers,
  configs,
  setFilterLabel,
}) => {
  const renderLabels = (labels: ConfigurationLabels): React.ReactNode => (
    <Labels>
      {Object.keys(labels).map(key => (
        <Label key={key} onClick={() => setFilterLabel(key, labels[key])}>
          {`${key}=${labels[key]}`}
        </Label>
      ))}
    </Labels>
  );

  return (
    <TreeView>
      <TreeView.Head>
        {headers.map((header, idx) => (
          <TreeView.Col key={idx}>{header}</TreeView.Col>
        ))}
      </TreeView.Head>
      <TreeView.Tree>
        {configs &&
          configs.map((config, idx) => (
            <TreeView.Item key={idx}>
              <TreeView.Row>
                <TreeView.Col>
                  <div>
                    <span
                      className={
                        config.name === DEFAULT_CONFIGURATION
                          ? 'fd-tree__col--control--default-config'
                          : ''
                      }
                    >
                      {`${config.name}${
                        config.name === DEFAULT_CONFIGURATION
                          ? ' (default)'
                          : ''
                      }`}
                    </span>
                    {config.name === DEFAULT_CONFIGURATION ? (
                      <InlineHelp
                        placement="bottom-right"
                        text={DEFAULT_CONFIGURATION_DESCRIPTION}
                      />
                    ) : null}
                  </div>
                </TreeView.Col>
                <TreeView.Col>
                  {config.labels ? (
                    renderLabels(config.labels)
                  ) : (
                    <NoAvailableLabelsText>
                      {NO_LABELS_AVAILABLE}
                    </NoAvailableLabelsText>
                  )}
                </TreeView.Col>
                <TreeView.Col>
                  <TreeViewColActions>
                    {config.name !== DEFAULT_CONFIGURATION ? (
                      <AddUrlModal configurationName={config.name} />
                    ) : null}
                    <DeleteConfigurationModal configurationName={config.name} />
                  </TreeViewColActions>
                </TreeView.Col>
              </TreeView.Row>
              <TreeView.Branch>
                <TreeView.Item>
                  {config.urls.map(url => (
                    <TreeView.Row key={url}>
                      <TreeView.Col className="add-ons-url">
                        {url.startsWith('http') ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        ) : (
                          url
                        )}
                        <DeleteUrlModal
                          configurationName={config.name}
                          url={url}
                        />
                      </TreeView.Col>
                    </TreeView.Row>
                  ))}
                </TreeView.Item>
              </TreeView.Branch>
            </TreeView.Item>
          ))}
      </TreeView.Tree>
    </TreeView>
  );
};

export default TableContentComponent;
