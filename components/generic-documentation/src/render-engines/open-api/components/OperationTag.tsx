import React from 'react';
import styled from 'styled-components';
import cssEscape from 'css.escape';
import { sanitizeUrl as braintreeSanitizeUrl } from '@braintree/sanitize-url';

import { Icon } from '@kyma-project/react-components';

const StyledIcon = styled(Icon)`
  font-size: 14px;
`;

const createDeepLinkPath = (str?: string) => {
  if (!str) {
    return '';
  }

  return str.trim().replace(/\s/g, '%20');
};

const escapeDeepLinkPath = (str: string) =>
  cssEscape(createDeepLinkPath(str).replace(/%20/g, '_'));

const sanitizeUrl = (url?: string) => {
  if (!url) {
    return '';
  }

  return braintreeSanitizeUrl(url);
};

export const OperationTagExtended = (Orig: typeof React.Component, _: any) =>
  class OperationTag extends React.Component<any, any> {
    static defaultProps = {
      tagObj: _.Im.fromJS({}),
      tag: '',
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

      const { docExpansion, deepLinking } = getConfigs();
      const isDeepLinkingEnabled = deepLinking && deepLinking !== 'false';

      const Collapse = getComponent('Collapse');
      const Markdown = getComponent('Markdown');
      const DeepLink = getComponent('DeepLink');
      const Link = getComponent('Link');

      const tagDescription = tagObj.getIn(['tagDetails', 'description'], null);
      const tagExternalDocsDescription = tagObj.getIn([
        'tagDetails',
        'externalDocs',
        'description',
      ]);
      const tagExternalDocsUrl = tagObj.getIn([
        'tagDetails',
        'externalDocs',
        'url',
      ]);

      const isShownKey = ['operations-tag', tag];
      const showTag = layoutSelectors.isShown(
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
                      onClick={(e: any) => e.stopPropagation()}
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
