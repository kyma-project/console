import nodeAllowed from './rbac-rules-matcher';

// Allowance

const allowEverything = {
  apiGroups : ["*"],
  resources : ["*"],
  verbs : ['*']
};


const allowGetListWatchAB = {
  apiGroups : ["groupA", "groupB"],
  resources : ["resourceA", "resourceB"],
  verbs : ["get","list","watch"]
};

const allowGetListWatchA = {
  apiGroups : ["groupA"],
  resources : ["resourceA"],
  verbs : ["get","list","watch"]
};

const allowUpdateA = {
  apiGroups : ["groupA"],
  resources : ["resourceA"],
  verbs : ["update"]
};

// Permission Requiremenst

const groupA_resourceA = {
  apiGroup : "groupA",
  resource : "resourceA"
}

const groupB_resourceB = {
  apiGroup : "groupB",
  resource : "resourceB"
}

const require = (verbs) => {
  return {
    verbs,
    from : (resource) => {
      return Object.assign({verbs}, resource)
    }
  };
}

describe('nodeAllowed', () => {
  describe('corner cases', () => {
    test('resolves true for null node', () => {
      expect(nodeAllowed(null, null)).toBe(true);
    });
    test('resolves true for undefined node', () => {
      expect(nodeAllowed(undefined, null)).toBe(true);
    });
    test('resolves true for node with undefined permission rules', () => {
      expect(nodeAllowed({}, null)).toBe(true);
    });
    test('resolves true for node with empty permission rules', () => {
      expect(nodeAllowed({requiredPermissions : []}, null)).toBe(true);
    });
    test('resolves true for null selfsubjectreview rules', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(['get']).from(groupA_resourceA)]
      }, null)).toBe(true);
    });
    test('resolves true for undefined selfsubjectreviewrules rules', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(["get"]).from(groupA_resourceA)]
      }, undefined)).toBe(true);
    });
    test('resolves true for empty selfsubjectreviewrules rules', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(["get"]).from(groupA_resourceA)]
      }, [])).toBe(true);
    });
  });

  describe(' in case of joker "*" rules', () => {
    test('resolves true for all-* rules', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(["get"]).from(groupA_resourceA)]
      }, [allowEverything])).toBe(true);
    });
  });

  describe(' in case SINGLE required permissions allowed by one rule', () => {
    test('resolves true when groupA:resourceA:{GET} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(["get"]).from(groupA_resourceA)]
      }, [ allowGetListWatchA])).toBe(true);
    });
    test('resolves true when groupA:resourceA:{LIST} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(["list"]).from(groupA_resourceA)]
      }, [allowGetListWatchA])).toBe(true);
    });
    test('resolves true when groupA:resourceA:{WATCH} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({
        requiredPermissions : [require(["watch"]).from(groupA_resourceA)]
      }, [allowGetListWatchA])).toBe(true);
    });
    test('resolves true when groupA:resourceA:{GET,LIST} is required and { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({requiredPermissions : [require(["get", "list"]).from(groupA_resourceA)]
      }, [allowGetListWatchA])).toBe(true);
    });
  });

  describe(' in case SINGLE required permissions not covered by any rule', () => {
    test('resolves false when groupA:resourceA:{UPDATE} is required and only { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({requiredPermissions : [require(["update"]).from(groupA_resourceA)]
      }, [allowGetListWatchA])).toBe(false);
    });
    test('resolves false when groupA:resourceA:{UPDATE} is required and only { GET, LIST, WATCH } and { DELETE } is allowed', () => {
      expect(nodeAllowed({requiredPermissions : [require(["update"]).from(groupA_resourceA)]
      }, [allowGetListWatchA, {
        apiGroups : ["groupA"],
        resources : ["resourceA"],
        verbs : ["delete"]
      }])).toBe(false);
    });
  });

  describe(' in case TWO required verb permissions covered only partially by one rule', () => {
    test('resolves false when groupA:resourceA:{LIST,UPDATE} is required and only { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({requiredPermissions : [require(["get", "list", "update"]).from(groupA_resourceA)]
      }, [allowGetListWatchA])).toBe(false);
    });
  });

  describe(' in case of MULTIPLE required verb permissions ', () => {
    test('resolves true when groupA:resourceA:{LIST,UPDATE} is required and { GET, LIST, WATCH } and { UPDATE } is allowed', () => {
      expect(nodeAllowed({requiredPermissions : [require(["get", "list", "update"]).from(groupA_resourceA)]
      }, [allowGetListWatchA, allowUpdateA])).toBe(true);
    });
  });

  describe(' in case MULTIPLE permissions', () => {
    test('resolves false when groupA:resourceA:{UPDATE} and groupA:resourceA:{GET} is required but only  { GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({
        requiredPermissions : [
          require(["update"]).from(groupA_resourceA),
          require(["get"]).from(groupA_resourceA),
        ]
      }, [allowGetListWatchA])).toBe(false);
    });

    test('resolves true when groupA:resourceA:{UPDATE} and groupA:resourceA:{GET} is required and  { GET, LIST, WATCH } and { UPDATE } is allowed', () => {
      expect(nodeAllowed({
        requiredPermissions : [
         require(["update"]).from(groupA_resourceA),
         require(["get"]).from(groupA_resourceA),
        ]
      }, [allowGetListWatchA, allowUpdateA])).toBe(true);
    });

    test('resolves false when groupA:resourceA:{GET,LIST} and groupB:resourceB:{GET} is required and only groupA:resourceA:{ GET, LIST, WATCH } is allowed', () => {
      expect(nodeAllowed({
        requiredPermissions : [
         require(["get", "list"]).from(groupA_resourceA),
         require(["get"]).from(groupB_resourceB),
        ]
      }, [allowGetListWatchA])).toBe(false);
    });


    test('resolves true when groupA:resourceA:{GET,LIST} and groupB:resourceB:{GET} is required and { GET, LIST, WATCH } is allowed for both A&B resources', () => {
      expect(nodeAllowed({
        requiredPermissions : [
         require(["get", "list"]).from(groupA_resourceA),
         require(["get"]).from(groupB_resourceB),
        ]
      }, [allowGetListWatchAB])).toBe(true);
    });
  });
});
