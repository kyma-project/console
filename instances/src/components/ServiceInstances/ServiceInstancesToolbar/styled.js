import styled from 'styled-components';

import {
  FormLabel as UnstyledFormLabel,
  Panel as UnstyledPanel,
  PanelBody as UnstyledPanelBody,
  FormItem as UnstyledFormItem,
} from '@kyma-project/react-components';

export const FiltersDropdownWrapper = styled.div`
  .fd-popover__body--right {
    &:after {
      right: 22px;
    }
  }

  .fd-popover__body--right {
    margin-top: 5px;
    right: 0px;

    &:before {
      right: 22px;
    }
  }
`;

export const FormItem = styled(UnstyledFormItem)`
  display: flex;
`;

export const FormLabel = styled(UnstyledFormLabel)`
  &&& {
    position: relative;
    top: -2px;
    font-size: 16px;
    padding-right: 20px;
    white-space: nowrap;
  }
`;

export const PanelBody = styled(UnstyledPanelBody)`
  && {
    padding: 12px;
  }
`;

export const Panel = styled(UnstyledPanel)`
  && {
    min-width: 200px;
  }
`;
