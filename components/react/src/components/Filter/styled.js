import styled from 'styled-components';
import { sizes } from '../../commons';

import {
  FormLabel as UnstyledFormLabel,
  Panel as UnstyledPanel,
  FormItem as UnstyledFormItem,
} from 'fundamental-react';

export const FiltersDropdownWrapper = styled.div`
  .fd-button--emphasized {
    padding-left: 30px;
    padding-right: 30px;

    @media (min-width: ${sizes.tablet}px) {
      margin-left: 87px;
    }
  }

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

export const PanelBody = styled(UnstyledPanel.Body)`
  && {
    padding: 12px;
  }
`;

export const Panel = styled(UnstyledPanel)`
  && {
    min-width: 200px;
  }
`;
export const SearchWrapper = styled.div`
  max-width: 640px;
  flex: 1 0 auto;
`;
