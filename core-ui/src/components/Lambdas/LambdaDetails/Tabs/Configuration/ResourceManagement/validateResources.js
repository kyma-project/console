const cpuRegexp = /(^\d+(\.\d+)?$)|(^\d+[m]$)/;
const memoryRegexp = /^\d+(\.\d+)?(Gi|Mi|Ki|G|M|K)?$/;

const validate = (resources, replicas) => {
  let ok = true;
  let message = '';

  if (Number(replicas.min) < 0 || Number(replicas.max) < 0) {
    ok = false;
    message = `${message}`;
  }

  if (Number(replicas.min) > Number(replicas.max)) {
    ok = false;
    message = 'Minimum number of replicas is higher than maximum. ';
  }
  const requests = resources.requests;
  const limits = resources.limits;

  if (!(cpuRegexp.test(requests.cpu) && cpuRegexp.test(limits.cpu))) {
    ok = false;
    message = `${message}CPU values must match regular expression ${cpuRegexp}. `;
  }

  if (
    !(memoryRegexp.test(requests.memory) && memoryRegexp.test(limits.memory))
  ) {
    ok = false;
    message = `${message}Memory values must match ${memoryRegexp}`;
  }

  return { ok, message };
};
