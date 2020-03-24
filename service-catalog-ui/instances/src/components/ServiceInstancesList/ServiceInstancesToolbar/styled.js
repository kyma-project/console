import styled from 'styled-components';
import { sizes } from '@kyma-project/react-components';

import {
  FormLabel as UnstyledFormLabel,
  Panel as UnstyledPanel,
  PanelBody as UnstyledPanelBody,
  FormItem as UnstyledFormItem,
  FormInput as UnstyledFormInput,
} from '@kyma-project/react-components';

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
export const FormInput = styled(UnstyledFormInput)`
  &&:checked:before {
    border-color: #fff;
  }
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
export const SearchWrapper = styled.div`
  max-width: 640px;
  flex: 1 0 auto;
  .fd-input {
    background-color: var(--fd-forms-background-color);
    border-color: var(--fd-forms-border-color);
    border-radius: 4px;
    color: var(--fd-color-text-1);
    &:focus {
      box-shadow: 0 0 0 1px var(--fd-color-action-focus);
      --fd-forms-border-color: var(--fd-color-action-focus);
    }
  }
`;
