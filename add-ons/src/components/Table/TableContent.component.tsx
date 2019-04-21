import React from 'react';
import { TreeView, Popover, Button, InlineHelp } from 'fundamental-react';

import DeleteConfigurationModal from '../Modals/DeleteConfigurationModal/DeleteConfigurationModal.container';
import AddUrlModal from '../Modals/AddUrlModal/AddUrlModal.container';
import DeleteUrlModal from '../Modals/DeleteUrlModal/DeleteUrlModal.container';

import { Label, Labels, TreeViewColActions } from './styled';

import { Configuration } from '../../types';
import {
  DEFAULT_CONFIGURATION,
  DEFAULT_CONFIGURATION_DESCRIPTION,
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
                      {config.name}
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
                  <Labels>
                    {Object.keys(config.labels).map(key => (
                      <Label
                        key={key}
                        onClick={() => setFilterLabel(key, config.labels[key])}
                      >
                        {`${key}=${config.labels[key]}`}
                      </Label>
                    ))}
                  </Labels>
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
                        <a href={url} target="_blank">
                          {url}
                        </a>
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
