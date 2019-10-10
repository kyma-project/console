import React, { useRef, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import {
  InlineHelp,
  FormFieldset,
  FormItem,
  FormLabel,
  FormSet,
} from 'fundamental-react';
import './CreateNamespaceForm.scss';
import LabelSelectorInput from '../LabelSelectorInput/LabelSelectorInput';

import {
  CREATE_LIMIT_RANGE,
  CREATE_NAMESPACE,
  CREATE_RESOURCE_QUOTA,
} from '../../gql/mutations';
import extractGraphQlErrors from '../../shared/graphqlErrorExtractor';

import { K8sNameField } from './K8sNameField';

const LIMIT_REGEX =
  '^[+]?[0-9]*(.[0-9]*)?(([eE][-+]?[0-9]+(.[0-9]*)?)?|([MGTPE]i?)|Ki|k|m)?$';

const ISTIO_INJECTION_LABEL = 'istio-injection=disabled';

function convertLabelsArrayToObject(labelsArray) {
  return Object.fromEntries(labelsArray.map(label => label.split('=')));
}

const DisableSidecarField = ({ onChange }) => {
  return (
    <FormFieldset>
      <FormItem isCheck>
        <input
          className="fd-form__control"
          type="checkbox"
          id="disable-istio"
          placeholder="disable side-car"
          onChange={e => onChange(e.target.checked)}
        />
        <FormLabel htmlFor="disable-istio">
          Disable side-car injection
          <InlineHelp
            placement="bottom-right"
            text="
                Select this option to disable istio to mediate all
                  communication between the pods in your namespace.
                "
          />
        </FormLabel>
      </FormItem>
    </FormFieldset>
  );
};

const MemoryQuotasCheckbox = ({ checkboxRef, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <FormFieldset>
      <FormItem isCheck>
        <input
          className="fd-form__control"
          ref={checkboxRef}
          type="checkbox"
          id="memory-quotas"
          onChange={e => setIsExpanded(e.target.checked)}
        />
        <FormLabel htmlFor="memory-quotas">
          Apply Total Memory Quotas
          <InlineHelp
            placement="bottom-right"
            text="
                 Define constraints that limit total memory consumption in your
                  namespace. 
                  Use plain value in bytes, or suffix equivalents. For example:
                  128974848, 129e6, 129M, 123Mi.
                "
          />
        </FormLabel>
        {isExpanded && children}
      </FormItem>
    </FormFieldset>
  );
};

const SectionRow = ({
  id,
  description,
  placeholder,
  pattern,
  reference,
  defaultValue,
  type = 'text',
  required = true,
}) => (
  <>
    <FormLabel htmlFor={id}>{description}</FormLabel>
    <input
      id={id}
      placeholder={placeholder}
      type={type}
      defaultValue={defaultValue}
      pattern={pattern}
      ref={reference}
      required={required}
    />
  </>
);

const MemoryQuotasSection = ({ limitsRef, requestsRef }) => (
  <FormSet className="input-fields" data-test-id="memory-quotas-section">
    <SectionRow
      id="memory-limit"
      reference={limitsRef}
      defaultValue="3Gi"
      pattern={LIMIT_REGEX}
      description="Memory limit *"
      placeholder="Memory limit"
    />
    <SectionRow
      id="memory-requests"
      placeholder="Memory requests"
      type="text"
      defaultValue="2.8Gi"
      pattern={LIMIT_REGEX}
      reference={requestsRef}
      description="Memory requests *"
    />
  </FormSet>
);

const ContainerLimitsCheckbox = ({ checkboxRef, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <FormFieldset>
      <FormItem isCheck>
        <input
          className="fd-form__control"
          ref={checkboxRef}
          type="checkbox"
          id="container-limits"
          onChange={e => setIsExpanded(e.target.checked)}
        />
        <FormLabel htmlFor="container-limits">
          Apply limits per container
          <InlineHelp
            placement="bottom-right"
            text="
                  Define memory constraints for individual containers in your
                  namespace. Use plain value in bytes, or suffix
                  equivalents. For example: 128974848, 129e6, 129M, 123Mi.
                "
          />
        </FormLabel>
        {isExpanded && children}
      </FormItem>
    </FormFieldset>
  );
};

const ContainerLimitSection = ({ maxRef, defaultRef, requestRef }) => (
  <FormSet className="input-fields" data-test-id="container-limits-section">
    <SectionRow
      id="container-max"
      placeholder="Max"
      type="text"
      defaultValue="1Gi"
      pattern={LIMIT_REGEX}
      reference={maxRef}
      description="Max *"
    />
    <SectionRow
      id="container-default"
      placeholder="Default"
      type="text"
      defaultValue="512Mi"
      pattern={LIMIT_REGEX}
      reference={defaultRef}
      description="Default *"
    />
    <SectionRow
      id="container-default-request"
      placeholder="Default request"
      type="text"
      defaultValue="32Mi"
      pattern={LIMIT_REGEX}
      reference={requestRef}
      description="Default request *"
    />
  </FormSet>
);

function getResourceQuotaMutationVars(memoryQuotas, namespaceName) {
  return memoryQuotas
    ? {
        variables: {
          ...memoryQuotas,
          namespace: namespaceName,
          name: `${namespaceName}`,
        },
      }
    : null;
}

function getLimitRangeMutationVars(containerLimits, namespaceName) {
  return containerLimits
    ? {
        variables: {
          ...containerLimits,
          namespace: namespaceName,
          name: `${namespaceName}`,
        },
      }
    : null;
}

const CreateNamespaceForm = ({
  formElementRef,
  onChange,
  onCompleted,
  onError,
  performManualSubmit,
}) => {
  const [labels, setLabels] = useState([]);
  const [readonlyLabels, setReadonlyLabels] = useState([]);

  const formValues = {
    name: useRef(null),
    memoryQuotas: {
      enableMemoryQuotas: useRef(null),
      memoryLimit: useRef(null),
      memoryRequests: useRef(null),
    },
    containerLimits: {
      enableContainerLimits: useRef(null),
      max: useRef(null),
      default: useRef(null),
      defaultRequest: useRef(null),
    },
  };

  const [createNamespaceMutation] = useMutation(CREATE_NAMESPACE);
  const [createLimitRangeMutation] = useMutation(CREATE_LIMIT_RANGE);
  const [createResourceQuotaMutation] = useMutation(CREATE_RESOURCE_QUOTA);

  function handleLabelsChanged(newLabels) {
    setLabels(newLabels);
  }

  function handleIstioChange(disableSidecar) {
    let newLabels = readonlyLabels.filter(l => l !== ISTIO_INJECTION_LABEL);

    if (disableSidecar) {
      newLabels.push(ISTIO_INJECTION_LABEL);
    }

    setReadonlyLabels(newLabels);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const k8sLabels = convertLabelsArrayToObject([
      ...labels,
      ...readonlyLabels,
    ]);
    const namespaceData = {
      name: formValues.name.current.value,
      labels: k8sLabels,
    };

    const memoryQuotas = formValues.memoryQuotas.enableMemoryQuotas.current
      .checked
      ? {
          resourceQuota: {
            limits: {
              memory: formValues.memoryQuotas.memoryLimit.current.value,
            },
            requests: {
              memory: formValues.memoryQuotas.memoryRequests.current.value,
            },
          },
        }
      : null;

    const containerLimits = formValues.containerLimits.enableContainerLimits
      .current.checked
      ? {
          limitRange: {
            max: {
              memory: formValues.containerLimits.max.current.value,
            },
            default: {
              memory: formValues.containerLimits.default.current.value,
            },
            defaultRequest: {
              memory: formValues.containerLimits.defaultRequest.current.value,
            },
            type: 'Container',
          },
        }
      : null;

    try {
      await createNamespaceMutation({ variables: namespaceData });

      const additionalRequests = [];
      if (memoryQuotas) {
        additionalRequests.push(
          createResourceQuotaMutation(
            getResourceQuotaMutationVars(memoryQuotas, namespaceData.name),
          ),
        );
      }

      if (containerLimits) {
        additionalRequests.push(
          createLimitRangeMutation(
            getLimitRangeMutationVars(containerLimits, namespaceData.name),
          ),
        );
      }

      const additionalResults = await Promise.allSettled(additionalRequests);
      const rejectedRequest = additionalResults.find(
        result => result.status === 'rejected',
      );
      if (rejectedRequest) {
        const err = new Error(extractGraphQlErrors(rejectedRequest.reason));
        err.additionalRequestFailed = true;
        throw err;
      }

      onCompleted('Success', `Namespace ${namespaceData.name} created.`);
    } catch (e) {
      if (e.additionalRequestFailed) {
        onError(
          'Warning',
          `Your namespace ${namespaceData.name} was created successfully, however, Limit Range and/or Resource Quota creation failed. You have to create them manually later: ${e}`,
          true,
        );
      } else {
        const errorToDisplay = extractGraphQlErrors(e);
        onError('ERROR', `Error while creating namespace: ${errorToDisplay}`);
      }
    }
  }

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
      <div className="fd-form__set">
        <div className="fd-form__item">
          <K8sNameField
            _ref={formValues.name}
            id="runtime-name"
            kind="Namespace"
            onKeyDown={e => {
              if (e.keyCode === 13) {
                performManualSubmit();
              }
            }}
          />
        </div>
        <div className="fd-form__item">
          <label className="fd-form__label">Labels</label>
          <LabelSelectorInput
            labels={labels}
            readonlyLabels={readonlyLabels}
            onChange={handleLabelsChanged}
          />
        </div>
        <div className="fd-form__item">
          <DisableSidecarField onChange={handleIstioChange} />
        </div>
        <div className="fd-form__item">
          <MemoryQuotasCheckbox
            checkboxRef={formValues.memoryQuotas.enableMemoryQuotas}
          >
            <MemoryQuotasSection
              limitsRef={formValues.memoryQuotas.memoryLimit}
              requestsRef={formValues.memoryQuotas.memoryRequests}
            />
          </MemoryQuotasCheckbox>

          <ContainerLimitsCheckbox
            checkboxRef={formValues.containerLimits.enableContainerLimits}
          >
            <ContainerLimitSection
              maxRef={formValues.containerLimits.max}
              defaultRef={formValues.containerLimits.default}
              requestRef={formValues.containerLimits.defaultRequest}
            />
          </ContainerLimitsCheckbox>
        </div>
      </div>
    </form>
  );
};

CreateNamespaceForm.propTypes = {
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired, // used to store <form> element reference
  isValid: PropTypes.bool,
  onChange: PropTypes.func,
  onError: PropTypes.func, // args: title(string), message(string)
  onCompleted: PropTypes.func, // args: title(string), message(string)
  performManualSubmit: PropTypes.func, // no args
};

export default CreateNamespaceForm;
