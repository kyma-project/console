import rbacRulesMatched from './rbac-rules-matcher';
import { config } from './luigi-config';

const ADMIN_ONLY_PATH_SEGMENTS = [
  'cmf-applications',
  'cmf-scenarios',
  'cmf-runtimes'
];
const NON_ADMIN_PATH_SEGMENTS = ['cmf-apps'];

let selfSubjectRulesReview = [];
export let backendModules = [];

export function setInitValues(_backendModules, _selfSubjectRulesReview) {
  backendModules = _backendModules;
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
        module => {
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

function isVisibleForCurrentGroup(node) {
  const authObject = Luigi.auth().store.getAuthData();
  if (
    !authObject ||
    !authObject.profile ||
    !Array.isArray(authObject.profile.groups)
  )
    return true; // couldn't read groups from auth object

  const isAdmin = authObject.profile.groups.includes(config.adminsGroupName);

  if (ADMIN_ONLY_PATH_SEGMENTS.includes(node.pathSegment)) return isAdmin;
  if (NON_ADMIN_PATH_SEGMENTS.includes(node.pathSegment)) return !isAdmin;

  return true;
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
    checkRequiredBackendModules(nodeToCheckPermissionsFor) &&
    isVisibleForCurrentGroup(nodeToCheckPermissionsFor)
  );
}
