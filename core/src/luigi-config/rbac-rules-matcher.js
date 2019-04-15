function nodeAllowed(nodeToCheckPermissionsFor, selfSubjectRulesReview) {
  if (nodeToCheckPermissionsFor === null || nodeToCheckPermissionsFor === undefined || nodeToCheckPermissionsFor.requiredPermissions === null || nodeToCheckPermissionsFor.requiredPermissions === undefined || nodeToCheckPermissionsFor.requiredPermissions.length === 0
    || selfSubjectRulesReview === null || selfSubjectRulesReview === undefined || selfSubjectRulesReview.length === 0) {
    return true;
  } else {
    for(var i = 0, len = nodeToCheckPermissionsFor.requiredPermissions.length; i < len; i++){
      let requiredPermission = nodeToCheckPermissionsFor.requiredPermissions[i];
      for(var j = 0, vlen = requiredPermission.verbs.length; j < vlen; j++){
        let atomicVerb = requiredPermission.verbs[j];
          let atomicVerbPermission = {
          apiGroup : requiredPermission.apiGroup,
          resource : requiredPermission.resource,
          verbs : [atomicVerb]
        }
        if(!matchingRuleFound(selfSubjectRulesReview, atomicVerbPermission)){
          return false;
        }
      }
    }
  return true;
  }
}

function arrayContainStringOrJoker(array, stringToFind, jokerString) {
    if(array === null || array === undefined) {
      return false;
    }
    let contains = false
    let element;
    for (var i = 0, len = array.length; i < len; i++) {
      element = array[i];
      if (element === stringToFind || element === jokerString) {
        contains = true;
        break;
      }
    }
    return contains;
}

function matchingRuleFound(allrules, requiredRule) {
  if(allrules === null || allrules === undefined) {
    return false;
  }
  let matchFound = false
  for (var i = 0, len = allrules.length; i < len; i++) {
  let rule = allrules[i];
      if (arrayContainStringOrJoker(rule.apiGroups, requiredRule.apiGroup, '*') &&
      arrayContainStringOrJoker(rule.resources, requiredRule.resource, '*') &&
      arrayContainsAllStringsOrJoker(rule.verbs, requiredRule.verbs, '*')){
        matchFound = true;
        break;
      }
  }
  return matchFound;
}

function arrayContainsAllStringsOrJoker (array, arrayOfStringsToFind, jokerString) {
  for (var i = 0, len = array.length; i < len; i++) {
    if(array[i] === jokerString){
      return true;
    }
  }

  for (var i = 0, len = arrayOfStringsToFind.length; i < len; i++) {
    let stringToFind = arrayOfStringsToFind[i];
    if(!array.includes(stringToFind)) {
      return false;
    }
  }
  return true;
}

module.exports = nodeAllowed;
