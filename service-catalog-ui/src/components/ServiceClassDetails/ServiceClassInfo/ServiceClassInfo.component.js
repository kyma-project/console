import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Label, Tooltip } from '@kyma-project/react-components';
import { Tile, Icon } from 'fundamental-react';

import {
  ServiceClassInfoContentWrapper,
  ExternalLink,
  Image,
  LabelsWrapper,
  LabelWrapper,
  ServiceClassHeaderTileGrid,
} from './styled';

import { serviceClassTileTitles } from 'helpers/constants';
import { isStringValueEqualToTrue } from 'helpers';
import ProvisionOnlyOnceInfo from '../ProvisionOnlyOnceInfo/ProvisionOnlyOnceInfo.component';

const ServiceClassInfo = ({
  creationTimestamp,
  documentationUrl,
  supportUrl,
  imageUrl,
  tags,
  labels,
  description,
  isProvisionedOnlyOnce,
  providerDisplayName,
  planSelector,
}) => {
  function sortTags(tag1, tag2) {
    return tag1.length > 8 && tag2.length < 15;
  }

  const extractLabels = () => {
    const extractedLabels = [];
    if (labels) {
      if (labels['connected-app'])
        extractedLabels.push({
          name: labels['connected-app'],
          type: 'connected-app',
        });
      if (isStringValueEqualToTrue(labels.local))
        extractedLabels.push({ name: 'local', type: 'basic' });
      if (isStringValueEqualToTrue(labels.showcase))
        extractedLabels.push({ name: 'showcase', type: 'basic' });
    }

    return extractedLabels;
  };

  const modifiedTags = [
    ...tags.map(tag => ({ name: tag, type: 'tag' })),
    ...extractLabels(),
  ];

  const tagsDescription = {
    basic: 'Basic filter',
    'connected-app': 'Connected application',
    provisionOnlyOnce: 'Provision only once',
    tag: 'Tag',
  };

  const tooltipWidth = {
    basic: '80px',
    'connected-app': '140px',
    provisionOnlyOnce: '140px',
    tag: '50px',
  };

  const computeNumberOfColumns = isProvisionedOnlyOnce => {
    const defaultNumberOfColumns = 4;
    return isProvisionedOnlyOnce
      ? defaultNumberOfColumns + 1
      : defaultNumberOfColumns;
  };

  const columnCount = computeNumberOfColumns(isProvisionedOnlyOnce);

  return (
    <ServiceClassInfoContentWrapper className="fd-has-padding-top-none">
      <ServiceClassHeaderTileGrid
        style={{
          gridTemplateColumns: `repeat(${columnCount} ,1fr)`,
        }}
      >
        <Tile>
          <Tile.Media className="fd-has-display-flex">
            {imageUrl ? (
              <Image size="l" photo={imageUrl} />
            ) : (
              <Icon glyph="crm-service-manager" />
            )}
          </Tile.Media>
          <Tile.Content title={serviceClassTileTitles.creator}>
            <p>{providerDisplayName}</p>
          </Tile.Content>
        </Tile>
        <Tile>
          <Tile.Content title={serviceClassTileTitles.lastUpdate}>
            <Moment
              unix
              format="MMM DD, YYYY"
              data-e2e-id="service-last-update"
            >
              {creationTimestamp}
            </Moment>
          </Tile.Content>
        </Tile>
        {documentationUrl && (
          <Tile>
            <Tile.Content title={serviceClassTileTitles.documentation}>
              <ExternalLink href={documentationUrl} target="_blank">
                Link
              </ExternalLink>
            </Tile.Content>
          </Tile>
        )}
        {supportUrl && (
          <Tile>
            <Tile.Content title={serviceClassTileTitles.support}>
              <ExternalLink href={supportUrl} target="_blank">
                Link
              </ExternalLink>
            </Tile.Content>
          </Tile>
        )}
        {isProvisionedOnlyOnce && (
          <Tile
            className="fd-has-grid-row-span-2 fd-has-padding-left-none"
            style={{ gridColumn: columnCount }}
          >
            <ProvisionOnlyOnceInfo />
          </Tile>
        )}
        <Tile className="fd-has-grid-column-span-4">
          <Tile.Content title={serviceClassTileTitles.description}>
            <p data-e2e-id="service-description">{description}</p>
          </Tile.Content>
        </Tile>
        {modifiedTags && modifiedTags.length > 0 && (
          <Tile
            style={{
              gridColumn: `span ${columnCount - (planSelector ? 2 : 0)}`,
            }}
          >
            <Tile.Content title={serviceClassTileTitles.tags}>
              <LabelsWrapper data-e2e-id="service-labels">
                {modifiedTags.sort(sortTags).map(tag => (
                  <LabelWrapper key={`${tag.type}-${tag.name}`}>
                    <Tooltip
                      content={tagsDescription[tag.type]}
                      minWidth={tooltipWidth[tag.type]}
                    >
                      <Label cursorType="help" data-e2e-id="service-label">
                        {tag.name}
                      </Label>
                    </Tooltip>
                  </LabelWrapper>
                ))}
              </LabelsWrapper>
            </Tile.Content>
          </Tile>
        )}
        {planSelector && (
          <Tile columnSpan="2">
            <Tile.Content title={serviceClassTileTitles.plans}>
              {planSelector}
            </Tile.Content>
          </Tile>
        )}
      </ServiceClassHeaderTileGrid>
    </ServiceClassInfoContentWrapper>
  );
};

ServiceClassInfo.propTypes = {
  creationTimestamp: PropTypes.number.isRequired,
  documentationUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.object,
  description: PropTypes.string,
};

export default ServiceClassInfo;
