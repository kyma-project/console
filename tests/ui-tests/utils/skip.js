function evaluate(condition) {
  return typeof condition === 'function' ? condition() : condition === true;
}

function describeIf(condition, name, _test) {
  if (evaluate(condition)) {
    describe(name, _test);
  } else {
    describe.skip(name, _test);
  }
}

module.exports = {
  describeIf,
};
