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

function testIf(condition, name, fn) {
  return test(name, async () => {
    if (!condition) {
      return () => {
        console.log(`Condition not satisfied. Skipping test ${name}...`);
      };
    }
    return fn();
  });
}

module.exports = {
  describeIf,
  testIf,
};
