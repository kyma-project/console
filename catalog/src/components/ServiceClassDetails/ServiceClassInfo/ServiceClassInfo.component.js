import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Icon, Header, Separator, Text } from '@kyma-project/react-components';

import {
  ServiceClassInfoContentWrapper,
  ImagePlaceholder,
  ServiceTitle,
  ServiceProvider,
  ExternalLink,
  Image,
  TagsWrapper,
  Tag,
} from './styled';

import { isStringValueEqualToTrue } from '../../../commons/helpers';

const ServiceClassInfo = ({
  serviceClassDisplayName,
  providerDisplayName,
  creationTimestamp,
  documentationUrl,
  supportUrl,
  imageUrl,
  tags,
  labels,
}) => {
  function sortTags(tag1, tag2) {
    return tag1.length > 8 && tag2.length < 15;
  }

  const extractLabels = () => {
    const extractedLabels = [];

    if (labels['connected-app']) extractedLabels.push(labels['connected-app']);
    if (isStringValueEqualToTrue(labels.local)) extractedLabels.push('local');
    if (isStringValueEqualToTrue(labels.showcase))
      extractedLabels.push('showcase');

    return extractedLabels;
  };

  const tagsAndLabels = [...tags, ...extractLabels()];

  return (
    <div>
      <ServiceClassInfoContentWrapper>
        <ImagePlaceholder imageUrl={imageUrl}>
          {imageUrl ? <Image src={imageUrl} /> : <Icon icon={'\ue113'} />}
        </ImagePlaceholder>
        <div>
          <ServiceTitle data-e2e-id="service-title">
            {serviceClassDisplayName}
          </ServiceTitle>
          <ServiceProvider data-e2e-id="service-provider">
            {providerDisplayName || ''}
          </ServiceProvider>
        </div>
      </ServiceClassInfoContentWrapper>
      <Separator margin="30px 0 30px" />
      <div>
        <Header margin="0 0 20px">Vendor Information</Header>
        <Text fontSize="14px">
          Last Update:{' '}
          <Moment unix format="MMM DD, YYYY">
            {creationTimestamp}
          </Moment>
        </Text>
        {documentationUrl && (
          <Text fontSize="14px">
            Documentation:{' '}
            <ExternalLink href={documentationUrl} target="_blank">
              Link
            </ExternalLink>
          </Text>
        )}
        {supportUrl && (
          <Text fontSize="14px">
            Support:{' '}
            <ExternalLink href={supportUrl} target="_blank">
              Link
            </ExternalLink>
          </Text>
        )}
        {tagsAndLabels &&
          tagsAndLabels.length > 0 && (
            <TagsWrapper>
              {tagsAndLabels
                .sort(sortTags)
                .map(tag => <Tag key={tag}>{tag}</Tag>)}
            </TagsWrapper>
          )}
      </div>
    </div>
  );
};

ServiceClassInfo.propTypes = {
  serviceClassDisplayName: PropTypes.string.isRequired,
  providerDisplayName: PropTypes.string.isRequired,
  creationTimestamp: PropTypes.number,
  documentationUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.object,
};

export default ServiceClassInfo;
