import React from 'react';

import { FormSet, FormLabel, FormInput } from 'fundamental-react';
import { Dropdown } from 'react-shared';
import { useConfigMapQuery } from 'components/Lambdas/gql';
import {
  WEBHOOK_DEFAULTS_CM_NAME,
  KYMA_SYSTEM_NAMESPACE,
  WEBHOOK_ENVS,
} from 'components/Lambdas/config';

const PRESET_CUSTOM = 'Custom';

function formatDropdownPresets(presets) {
  return Object.fromEntries(
    Object.entries(presets).map(([preset, values]) => [
      preset,
      `${preset} (requests: ${values.requestMemory}/${values.requestCpu}, limits: ${values.limitMemory}/${values.limitCpu})`,
    ]),
  );
}

export default function ScalingData({ deployment, setDeployment }) {
  const [preset, setPreset] = React.useState(PRESET_CUSTOM);

  const { cmData } = useConfigMapQuery({
    name: WEBHOOK_DEFAULTS_CM_NAME,
    namespace: KYMA_SYSTEM_NAMESPACE,
  });

  const configMapPresets = JSON.parse(
    cmData[WEBHOOK_ENVS.FUNCTION_RESOURCES_PRESETS_MAP] || '{}',
  );
  const presets = { ...configMapPresets, [PRESET_CUSTOM]: {} };
  const configMapDropdownPresets = formatDropdownPresets(configMapPresets);
  const dropdownPresets = {
    [PRESET_CUSTOM]: PRESET_CUSTOM,
    ...configMapDropdownPresets,
  };

  React.useEffect(() => {
    if (preset !== PRESET_CUSTOM) {
      const { limitCpu, limitMemory, requestCpu, requestMemory } = presets[
        preset
      ];
      setDeployment({
        ...deployment,
        requests: {
          memory: requestMemory,
          cpu: requestCpu,
        },
        limits: {
          memory: limitMemory,
          cpu: limitCpu,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <div>
      <h3 className="configuration-data__title">
        Runtime Profile
        <p className="fd-has-type-2 fd-has-color-text-3">
          Choose on of the presets or set your own values ​​by selecting the
          "Custom" option.
        </p>
      </h3>
      <Dropdown
        options={dropdownPresets}
        selectedOption={preset}
        onSelect={setPreset}
        width="100%"
        className="fd-has-margin-bottom-s"
      />
      {preset === PRESET_CUSTOM && (
        <>
          <FormSet className="configuration-data__form">
            <FormLabel>
              Memory requests
              <FormInput
                defaultValue={deployment.requests.memory}
                onChange={e =>
                  setDeployment({
                    ...deployment,
                    requests: {
                      ...deployment.requests,
                      memory: e.target.value,
                    },
                  })
                }
              />
            </FormLabel>
            <FormLabel>
              Memory limits
              <FormInput
                defaultValue={deployment.limits.memory}
                onChange={e =>
                  setDeployment({
                    ...deployment,
                    limits: {
                      ...deployment.limits,
                      memory: e.target.value,
                    },
                  })
                }
              />
            </FormLabel>
          </FormSet>
          <FormSet className="configuration-data__form">
            <FormLabel>
              CPU requests
              <FormInput
                defaultValue={deployment.requests.cpu}
                onChange={e =>
                  setDeployment({
                    ...deployment,
                    requests: {
                      ...deployment.requests,
                      cpu: e.target.value,
                    },
                  })
                }
              />
            </FormLabel>
            <FormLabel>
              CPU limits
              <FormInput
                defaultValue={deployment.limits.cpu}
                onChange={e =>
                  setDeployment({
                    ...deployment,
                    limits: {
                      ...deployment.limits,
                      cpu: e.target.value,
                    },
                  })
                }
              />
            </FormLabel>
          </FormSet>
        </>
      )}
    </div>
  );
}
