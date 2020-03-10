import rbacRulesMatched from './rbac-rules-matcher';
import { config } from './../config';
import { parseJWT } from './navigation-helpers';

const ADMIN_ONLY_PATH_SEGMENTS = [
  'cmf-applications',
  'cmf-scenarios',
  'cmf-runtimes'
];

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
  let currentGroups = node.context ? node.context.groups : null;
  if (!Array.isArray(currentGroups)) return true;
  const isAdmin = currentGroups.includes(config.adminsGroupName);
  if (ADMIN_ONLY_PATH_SEGMENTS.includes(node.pathSegment)) return isAdmin;
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


export function getGroups(token){
  try{
    return parseJWT(token).groups;
  } catch (e) {
    console.error("Could not parse groups from current token", e);
  }
}
