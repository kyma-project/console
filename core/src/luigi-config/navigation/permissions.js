import rbacRulesMatched from './rbac-rules-matcher';
import { config } from './../config';

let selfSubjectRulesReview = [];
export let backendModules = [];

export function setInitValues(_backendModules, _selfSubjectRulesReview) {
  backendModules = _backendModules.map((bm) => bm.name);
  selfSubjectRulesReview = _selfSubjectRulesReview;
}

function checkRequiredBackendModules(nodeToCheckPermissionsFor) {
  let hasPermissions = true;
  if (
    nodeToCheckPermissionsFor.context &&
    nodeToCheckPermissionsFor.context.requiredBackendModules &&
    nodeToCheckPermissionsFor.context.requiredBackendModules.length > 0
  ) {
    if (backendModules && backendModules.length > 0) {
      nodeToCheckPermissionsFor.context.requiredBackendModules.forEach(
        (module) => {
          if (hasPermissions && backendModules.indexOf(module) === -1) {
            hasPermissions = false;
          }
        }
      );
    } else {
      hasPermissions = false;
    }
  }
  return hasPermissions;
}

export default function navigationPermissionChecker(nodeToCheckPermissionsFor) {
  const noRulesApplied =
    !Array.isArray(nodeToCheckPermissionsFor.requiredPermissions) ||
    !nodeToCheckPermissionsFor.requiredPermissions.length;

  return (
    (noRulesApplied ||
      rbacRulesMatched(
        nodeToCheckPermissionsFor.requiredPermissions,
        selfSubjectRulesReview
      )) &&
    checkRequiredBackendModules(nodeToCheckPermissionsFor)
  );
}
