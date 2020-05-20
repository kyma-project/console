const HEALTHY_STATUSES = ['RUNNING', 'SUCCEEDED'];

export default function getPodsCounts(pods) {
  const allPodsCount = pods.length;
  const healthyPodsCount = pods.filter(pod =>
    HEALTHY_STATUSES.includes(pod.status),
  ).length;

  return [allPodsCount, healthyPodsCount];
}
