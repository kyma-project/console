import PropTypes from 'prop-types';

const customColumn = PropTypes.exact({
  header: PropTypes.string,
  value: PropTypes.func.isRequired, // gets the resource item as param; should return PropTypes.node
});

export const customColumnsType = PropTypes.arrayOf(customColumn);
