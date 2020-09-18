import { LAMBDA_PHASES } from 'components/Lambdas/constants';

export function statusType(phase = LAMBDA_PHASES.INITIALIZING.TYPE) {
  switch (phase) {
    case LAMBDA_PHASES.FAILED.TYPE:
    case LAMBDA_PHASES.NEW_REVISION_ERROR.TYPE:
      return 'error';
    case LAMBDA_PHASES.RUNNING.TYPE:
      return 'success';
    case LAMBDA_PHASES.INITIALIZING.TYPE:
      return 'info';
    default:
      return 'warning';
  }
}
