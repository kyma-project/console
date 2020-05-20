import styled from 'styled-components';

export const ToolbarWrapper = styled.section`
  background-color: #fff;
  padding: 32px;

  .fd-action-bar {
    padding: 0 !important; // override Toolbar styles
  }
`;

export const BreadcrumbWrapper = styled.div`
   {
    display: flex;
    justify-content: space-between;
    max-height: 1.25em;
    .fd-breadcrumb {
      margin-top: 30px;
      margin-left: 30px;
    }
  }
`;
