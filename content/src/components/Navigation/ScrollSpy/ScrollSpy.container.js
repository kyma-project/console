import { graphql, compose } from 'react-apollo';

import ScrollSpy from './ScrollSpy.component';

import { DOCS_LOADING_STATUS } from './queries';

export default compose(
  graphql(DOCS_LOADING_STATUS, {
    name: 'docsLoadingStatus',
  }),
)(ScrollSpy);
