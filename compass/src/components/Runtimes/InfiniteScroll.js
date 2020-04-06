import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { GET_RUNTIMES } from './gql';

const InfiniteScroll = ({ searchQuery }) => {
  const [cursor, setCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [entries, setEntries] = useState([]);
  const [canScrollMore, setCanScrollMore] = useState(true);

  const { loading, error } = useQuery(GET_RUNTIMES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      after: cursor,
    },
    onCompleted: rsp => {
      const { data, pageInfo } = rsp.runtimes;
      setEntries(prev => [...prev, ...data]);
      setCanScrollMore(pageInfo.hasNextPage);
      if (pageInfo.hasNextPage) {
        setNextCursor(pageInfo.endCursor);
      }
    },
  });

  function handleScroll(ev) {
    const {
      scrollHeight,
      scrollTop,
      clientHeight,
    } = ev.target.scrollingElement;
    if (scrollHeight - scrollTop === clientHeight) {
      setCursor(nextCursor);
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  });

  if (error) return `Error! ${error.message}`;

  return (
    <>
      <table className="fd-table">
        <thead className="fd-table__header">
          <tr className="fd-table__row">
            <th className="fd-table__cell" scope="col">
              Name
            </th>
          </tr>
        </thead>
        <tbody className="fd-table__body">
          {entries.map(r => (
            <tr className="fd-table__row" key={r.id}>
              <td className="fd-table__cell">{r.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fd-has-text-align-center fd-has-padding-bottom-xs">
        {!!loading && <Spinner />}
        {!canScrollMore && 'No more runtimes'}
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

export default InfiniteScroll;
