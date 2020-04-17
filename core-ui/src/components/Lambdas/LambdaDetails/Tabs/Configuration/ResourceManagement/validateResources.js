const cpuRegexp = /(^\d+(\.\d+)?$)|(^\d+[m]$)/;
const memoryRegexp = /^\d+(\.\d+)?(Gi|Mi|Ki|G|M|K)?$/;

const validate = (resources, replicas) => {
  if (Number(replicas.min) > Number(replicas.max)) {
    return {
      ok: false,
      message: 'Minimum number of replicas is higher than maximum',
    };
  }

  return {};
};
