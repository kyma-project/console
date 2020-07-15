import React, { useState, useEffect } from 'react';
import { Popover, Menu, Button } from 'fundamental-react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';

const SCROLL_MARGIN = 20;

const ListActions = ({ actions, entry }) => {
  return (
    <Popover
      body={
        <Menu>
          <Menu.List>
            {actions.map(a => (
              <Menu.Item onClick={() => a.handler(entry)} key={a.name}>
                {a.name}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu>
      }
      control={
        <Button
          glyph="vertical-grip"
          option="light"
          aria-label="more-actions"
        />
      }
      placement="bottom-end"
    />
  );
};

const InfiniteList = ({
  query,
  queryVariables,
  headerRenderer,
  rowRenderer,
  noMoreEntriesMessage,
  actions,
}) => {
  const [cursor, setCursor] = useState(null);
  const [entries, setEntries] = useState([]);

  const { data, loading, error } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables: {
      after: cursor,
      ...queryVariables,
    },
    onCompleted: rsp => {
      const { data: newEntries } = rsp.runtimes;
      setEntries(prev => [...prev, ...newEntries]);
    },
  });

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  });

  const canScrollMore = loading || data.runtimes.totalCount > entries.length;

  function handleScroll(ev) {
    const {
      scrollHeight,
      scrollTop,
      clientHeight,
    } = ev.target.scrollingElement;
    const hasReachedBottom =
      scrollHeight - scrollTop - SCROLL_MARGIN <= clientHeight;

    if (hasReachedBottom && data.runtimes.pageInfo.hasNextPage) {
      setCursor(data.runtimes.pageInfo.endCursor);
    }
  }

  if (error) return `Error! ${error.message}`;

  return (
    <>
      <table className="fd-table">
        <thead className="fd-table__header">
          <tr className="fd-table__row">
            {headerRenderer().map((h, index) => (
              <th className="fd-table__cell" scope="col" key={h || index}>
                {h}
              </th>
            ))}
            {actions.length && <th></th>}
          </tr>
        </thead>
        <tbody className="fd-table__body">
          {entries.map(r => (
            <tr className="fd-table__row" key={r.id}>
              {rowRenderer(r).map(([key, value]) => (
                <td
                  className="fd-table__cell fd-has-padding-top-tiny fd-has-padding-bottom-tiny"
                  key={key}
                >
                  {value}
                </td>
              ))}
              {actions.length && (
                <td>
                  <ListActions actions={actions} entry={r} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fd-has-text-align-center fd-has-padding-bottom-xs">
        {!!loading && <Spinner />}
        {!canScrollMore && noMoreEntriesMessage}
      </div>
    </>
  );
};

const Spinner = () => {
  return (
    <div className="fd-spinner" aria-hidden="false" aria-label="Loading">
      <div className="fd-spinner__body"></div>
    </div>
  );
};

export default InfiniteList;

InfiniteList.propTypes = {
  query: PropTypes.shape({
    data: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  queryVariables: PropTypes.object,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  noMoreEntriesMessage: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      handler: PropTypes.func.isRequired,
    }),
  ).isRequired,
};

InfiniteList.defaultProps = {
  noMoreEntriesMessage: 'No more data',
  actions: [],
};
