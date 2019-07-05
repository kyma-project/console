import React from 'react';
import PropTypes from 'prop-types';
import ImPropTypes from 'react-immutable-proptypes';
import cssEscape from 'css.escape';
import { sanitizeUrl as braintreeSanitizeUrl } from '@braintree/sanitize-url';

import styled from 'styled-components';
import { Icon } from '@kyma-project/react-components';

const StyledIcon = styled(Icon)`
  font-size: 14px;
`;
const createDeepLinkPath = str =>
  typeof str == 'string' || str instanceof String
    ? str.trim().replace(/\s/g, '%20')
    : '';
const escapeDeepLinkPath = str =>
  cssEscape(createDeepLinkPath(str).replace(/%20/g, '_'));

const sanitizeUrl = url => {
  if (typeof url !== 'string' || url === '') {
    return '';
  }

  return braintreeSanitizeUrl(url);
};

export const OperationTag = (Orig, { Im }) =>
  class OperationTag extends React.Component {
    static defaultProps = {
      tagObj: Im.fromJS({}),
      tag: '',
    };

    static propTypes = {
      tagObj: ImPropTypes.map.isRequired,
      tag: PropTypes.string.isRequired,

      layoutSelectors: PropTypes.object.isRequired,
      layoutActions: PropTypes.object.isRequired,

      getConfigs: PropTypes.func.isRequired,
      getComponent: PropTypes.func.isRequired,

      children: PropTypes.element,
    };

    render() {
      const {
        tagObj,
        tag,
        children,

        layoutSelectors,
        layoutActions,
        getConfigs,
        getComponent,
      } = this.props;

      let { docExpansion, deepLinking } = getConfigs();
      const isDeepLinkingEnabled = deepLinking && deepLinking !== 'false';

      const Collapse = getComponent('Collapse');
      const Markdown = getComponent('Markdown');
      const DeepLink = getComponent('DeepLink');
      const Link = getComponent('Link');

      let tagDescription = tagObj.getIn(['tagDetails', 'description'], null);
      let tagExternalDocsDescription = tagObj.getIn([
        'tagDetails',
        'externalDocs',
        'description',
      ]);
      let tagExternalDocsUrl = tagObj.getIn([
        'tagDetails',
        'externalDocs',
        'url',
      ]);

      let isShownKey = ['operations-tag', tag];
      let showTag = layoutSelectors.isShown(
        isShownKey,
        docExpansion === 'full' || docExpansion === 'list',
      );

      return (
        <div
          className={
            showTag ? 'opblock-tag-section is-open' : 'opblock-tag-section'
          }
        >
          <h4
            onClick={() => layoutActions.show(isShownKey, !showTag)}
            className={!tagDescription ? 'opblock-tag no-desc' : 'opblock-tag'}
            id={isShownKey.map(v => escapeDeepLinkPath(v)).join('-')}
            data-tag={tag}
            data-is-open={showTag}
          >
            <DeepLink
              enabled={isDeepLinkingEnabled}
              isShown={showTag}
              path={createDeepLinkPath(tag)}
              text={tag}
            />
            {tagDescription && showTag ? (
              <small>
                <Markdown source={tagDescription} />
              </small>
            ) : (
              <small />
            )}

            <div>
              {!tagExternalDocsDescription ? null : (
                <small>
                  {tagExternalDocsDescription}
                  {tagExternalDocsUrl ? ': ' : null}
                  {tagExternalDocsUrl ? (
                    <Link
                      href={sanitizeUrl(tagExternalDocsUrl)}
                      onClick={e => e.stopPropagation()}
                      target="_blank"
                    >
                      {tagExternalDocsUrl}
                    </Link>
                  ) : null}
                </small>
              )}
            </div>

            <button
              className="expand-operation"
              title={showTag ? 'Collapse operation' : 'Expand operation'}
              onClick={() => layoutActions.show(isShownKey, !showTag)}
            >
              {showTag ? (
                <StyledIcon glyph="navigation-up-arrow" />
              ) : (
                <StyledIcon glyph="navigation-down-arrow" />
              )}
            </button>
          </h4>

          <Collapse isOpened={showTag}>{children}</Collapse>
        </div>
      );
    }
  };
