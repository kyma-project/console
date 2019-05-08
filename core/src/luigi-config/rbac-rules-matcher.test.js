import rbacRulesMatched from './rbac-rules-matcher';

// Allowance

const allowEverything = {
  apiGroups: ['*'],
  resources: ['*'],
  verbs: ['*'],
};

const allowGetListWatchAB = {
  apiGroups: ['groupA', 'groupB'],
  resources: ['resourceA', 'resourceB'],
  verbs: ['get', 'list', 'watch'],
};

const allowGetListWatchA = {
  apiGroups: ['groupA'],
  resources: ['resourceA'],
  verbs: ['get', 'list', 'watch'],
};

const allowUpdateA = {
  apiGroups: ['groupA'],
  resources: ['resourceA'],
  verbs: ['update'],
};

// Permission Requiremenst

const groupA_resourceA = {
  apiGroup: 'groupA',
  resource: 'resourceA',
};

const groupB_resourceB = {
  apiGroup: 'groupB',
  resource: 'resourceB',
};

const require = verbs => {
  return {
    verbs,
    from: resource => {
      return Object.assign({ verbs }, resource);
    },
  };
};

describe('rbacRulesMatched', () => {
  describe('corner cases', () => {
    test('resolves true for null permission rules', () => {
      expect(rbacRulesMatched(null, null)).toBe(true);
    });
    test('resolves true for undefined permission rules', () => {
      expect(rbacRulesMatched(undefined, null)).toBe(true);
    });
    test('resolves true for node with empty permission rules', () => {
      expect(rbacRulesMatched([], null)).toBe(true);
    });
    test('resolves true for null selfsubjectreview rules', () => {
      expect(rbacRulesMatched([require(['get']).from(groupA_resourceA)], null)).toBe(
        true,
      );
    });
    test('resolves true for undefined selfsubjectreviewrules rules', () => {
      expect(
        rbacRulesMatched([require(['get']).from(groupA_resourceA)], undefined),
      ).toBe(true);
    });
    test('resolves true for empty selfsubjectreviewrules rules', () => {
      expect(rbacRulesMatched([require(['get']).from(groupA_resourceA)], [])).toBe(
        true,
      );
    });
  });

  describe(' in case of joker "*" rules', () => {
    test('resolves true for all-* rules', () => {
      expect(
        rbacRulesMatched(
          [
            require(['get']).from(groupA_resourceA),
            require(['maskopatol']).from({ apiGroup: 'foo', resource: 'bar' }),
          ],
          [allowEverything],
        ),
      ).toBe(true);
    });

    test('resolves false when groupB:foo:{CREATE} is required and all is allowed but in groupA', () => {
      expect(
        rbacRulesMatched(
          [
            require(['create']).from({apiGroup: 'groupB', resource: 'foo'}),
          ],
          [
            {
              apiGroups: ['groupA'],
              resources: ['*'],
              verbs: ['*'],
            }
          ],
        ),
      ).toBe(false);
    });


    test('resolves true when groupA:foo:{CREATE} is required and all is allowed in groupA:*:*', () => {
      expect(
        rbacRulesMatched(
          [
            require(['create']).from({apiGroup: 'groupA', resource: 'foo'}),
          ],
          [
            {
              apiGroups: ['groupA'],
              resources: ['*'],
              verbs: ['*'],
            }
          ],
        ),
      ).toBe(true);
    });
  });

  describe(' in case SINGLE required permissions allowed by one rule', () => {
    test('resolves true when groupA:resourceA:{GET} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['get']).from(groupA_resourceA)],
          [allowGetListWatchA],
        ),
      ).toBe(true);
    });
    test('resolves true when groupA:resourceA:{LIST} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['list']).from(groupA_resourceA)],
          [allowGetListWatchA],
        ),
      ).toBe(true);
    });
    test('resolves true when groupA:resourceA:{WATCH} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['watch']).from(groupA_resourceA)],
          [allowGetListWatchA],
        ),
      ).toBe(true);
    });
    test('resolves true when groupA:resourceA:{GET,LIST} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['get', 'list']).from(groupA_resourceA)],
          [allowGetListWatchA],
        ),
      ).toBe(true);
    });
  });

  describe(' in case SINGLE required permissions not covered by any rule', () => {
    test('resolves false when groupA:resourceA:{UPDATE} is required and only { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['update']).from(groupA_resourceA)],
          [allowGetListWatchA],
        ),
      ).toBe(false);
    });
    test('resolves false when groupA:resourceA:{UPDATE} is required and only { GET, LIST, WATCH } and { DELETE } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['update']).from(groupA_resourceA)],
          [
            allowGetListWatchA,
            {
              apiGroups: ['groupA'],
              resources: ['resourceA'],
              verbs: ['delete'],
            },
          ],
        ),
      ).toBe(false);
    });
  });

  describe(' in case of MULTIPLE required verb permissions', () => {
    test('resolves false when groupA:resourceA:{LIST,UPDATE} is required and only { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['get', 'list', 'update']).from(groupA_resourceA)],
          [allowGetListWatchA],
        ),
      ).toBe(false);
    });

    test('resolves true when groupA:resourceA:{LIST,UPDATE} is required and { GET, LIST, WATCH } and { UPDATE } is allowed', () => {
      expect(
        rbacRulesMatched(
          [require(['get', 'list', 'update']).from(groupA_resourceA)],
          [allowGetListWatchA, allowUpdateA],
        ),
      ).toBe(true);
    });
  });

  describe(' in case MULTIPLE permissions', () => {
    test('resolves false when groupA:resourceA:{UPDATE} and groupA:resourceA:{GET} is required but only  { GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [
            require(['update']).from(groupA_resourceA),
            require(['get']).from(groupA_resourceA),
          ],
          [allowGetListWatchA],
        ),
      ).toBe(false);
    });

    test('resolves true when groupA:resourceA:{UPDATE} and groupA:resourceA:{GET} is required and  { GET, LIST, WATCH } and { UPDATE } is allowed', () => {
      expect(
        rbacRulesMatched(
          [
            require(['update']).from(groupA_resourceA),
            require(['get']).from(groupA_resourceA),
          ],
          [allowGetListWatchA, allowUpdateA],
        ),
      ).toBe(true);
    });

    test('resolves false when groupA:resourceA:{GET,LIST} and groupB:resourceB:{GET} is required and only groupA:resourceA:{ GET, LIST, WATCH } is allowed', () => {
      expect(
        rbacRulesMatched(
          [
            require(['get', 'list']).from(groupA_resourceA),
            require(['get']).from(groupB_resourceB),
          ],
          [allowGetListWatchA],
        ),
      ).toBe(false);
    });

    test('resolves true when groupA:resourceA:{GET,LIST} and groupB:resourceB:{GET} is required and { GET, LIST, WATCH } is allowed for both A&B resources', () => {
      expect(
        rbacRulesMatched(
          [
            require(['get', 'list']).from(groupA_resourceA),
            require(['get']).from(groupB_resourceB),
          ],
          [allowGetListWatchAB],
        ),
      ).toBe(true);
    });

    test('resolves false when groupA:resourceA:{DELETE} and groupB:resourceB:{DELETE} is required but apiGroupB is missing in the allowed rules', () => {
      expect(
        rbacRulesMatched(
          [
            require(['delete']).from(groupA_resourceA),
            require(['delete']).from(groupB_resourceB),
          ],
          [
            {
              apiGroups: ['groupA'],
              resources: ['resourceA', 'resourceB'],
              verbs: ['delete'],
            },
          ],
        ),
      ).toBe(false);
    });

    test('resolves false when groupA:resourceA:{CREATE} and groupB:resourceB:{DELETE} is required but allowed verbs are oposite', () => {
      expect(
        rbacRulesMatched(
          [
            require(['create']).from(groupA_resourceA),
            require(['delete']).from(groupB_resourceB),
          ],
          [
            {
              apiGroups: ['groupA'],
              resources: ['resourceA'],
              verbs: ['delete'],
            },
            {
              apiGroups: ['groupB'],
              resources: ['resourceB'],
              verbs: ['create'],
            }
          ],
        ),
      ).toBe(false);
    });
  });
});
