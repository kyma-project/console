import React from 'react';
import { HeadersNavigation as HN } from '@kyma-project/documentation-component';
import { RenderedHeader } from './RenderedHeader';
import { postProcessingHeaders } from '../../helpers';
import { HeadersNavigationsWrapper, StyledHeadersNavigation } from './styled';

export const HeadersNavigation: React.FunctionComponent = () => (
  <HeadersNavigationsWrapper>
    <div>
      <HN postProcessing={postProcessingHeaders}>
        <StyledHeadersNavigation className="cms__toc-wrapper">
          <RenderedHeader />
        </StyledHeadersNavigation>
      </HN>
    </div>
  </HeadersNavigationsWrapper>
);
