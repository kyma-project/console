import rbacRulesMatched from './rbac-rules-matcher';
import { selfSubjectRulesReview, config } from './luigi-config';

const ADMIN_ONLY_PATH_SEGMENTS = [
  'cmf-applications',
  'cmf-scenarios',
  'cmf-runtimes'
];
const NON_ADMIN_PATH_SEGMENTS = ['cmf-apps'];

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
  const authObjectRaw = localStorage.getItem('luigi.auth');
  if (!authObjectRaw) return true; // couldn't get Luigi auth object from localStorage

  const authObject = JSON.parse(authObjectRaw);
  if (
    !authObject ||
    !authObject.profile ||
    !Array.isArray(authObject.profile.groups)
  )
    return true; // couldn't read groups from localStorage

  const isAdmin = authObject.profile.groups.includes(config.adminsGroupName);

  if (ADMIN_ONLY_PATH_SEGMENTS.includes(node.pathSegment)) return isAdmin;
  if (NON_ADMIN_PATH_SEGMENTS.includes(node.pathSegment)) return !isAdmin;

  return true;
}

export default function navigationPermissionChecker(nodeToCheckPermissionsFor) {
  const noRulesApplied =
    nodeToCheckPermissionsFor.requiredPermissions === null ||
    nodeToCheckPermissionsFor.requiredPermissions === undefined ||
    nodeToCheckPermissionsFor.requiredPermissions.length === 0;

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
