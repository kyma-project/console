import styled from 'styled-components';
import { Popover as FdPopover } from 'fundamental-react';
import { sizes } from '@kyma-project/react-components';

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

export const SearchWrapper = styled.div`
  max-width: 640px;
  flex: 1 0 auto;
  .fd-search-input {
    width: 100%;
  }
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

// override top: -4px;
export const Popover = styled(FdPopover)`
  top: 0px !important;
`;
