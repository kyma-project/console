import { mount } from 'enzyme';
import ServiceInstanceInfo from '../ServiceInstanceInfo';
import React from 'react';
import { instanceAllAttributes } from './mocks';
import {
  ServiceClassButton,
  ExternalLink,
  PlanModalButton,
  JSONCode,
} from '../styled';
import { Label } from '@kyma-project/react-components';
import { componentUpdate } from 'testing';
import { act } from 'react-dom/test-utils';

const mockNavigate = jest.fn();
const mockAddBackdrop = jest.fn();
const mockRemoveBackdrop = jest.fn();

jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: function() {
      return {
        fromContext: function() {
          return {
            navigate: mockNavigate,
          };
        },
      };
    },
    uxManager: function() {
      return {
        addBackdrop: mockAddBackdrop,
        removeBackdrop: mockRemoveBackdrop,
      };
    },
  };
});

describe('ServiceInstanceInfo', () => {
  describe('Render info with all attributes', () => {
    const component = mount(
      <ServiceInstanceInfo serviceInstance={instanceAllAttributes} />,
    );

    it('Has service class field with link', () => {
      const field = component.find('div[data-e2e-id="instance-service-class"]');
      expect(field.exists()).toBe(true);
      expect(field.text()).toEqual(
        instanceAllAttributes.clusterServiceClass.displayName,
      );

      const link = field.find(ServiceClassButton);
      link.simulate('click');

      expect(mockNavigate).toHaveBeenCalledWith(
        'cmf-service-catalog/details/a2257daa-0e26-4c61-a68d-8a7453c1b767',
      );
    });

    it('Has documentation field with link', () => {
      const field = component.find(
        'div[data-e2e-id="instance-service-documentation-link"]',
      );
      expect(field.exists()).toBe(true);

      const link = field.find(ExternalLink);
      expect(link.prop('href')).toEqual(
        instanceAllAttributes.clusterServiceClass.documentationUrl,
      );
    });

    it('Has support field with link', () => {
      const field = component.find(
        'div[data-e2e-id="instance-service-support-link"]',
      );
      expect(field.exists()).toBe(true);

      const link = field.find(ExternalLink);
      expect(link.prop('href')).toEqual(
        instanceAllAttributes.clusterServiceClass.supportUrl,
      );
    });

    it('Has labels field with link', () => {
      const field = component.find('div[data-e2e-id="instance-label"]');
      expect(field.exists()).toBe(true);

      const labels = field.find(Label);
      expect(labels.map(l => l.text()).sort()).toEqual(
        instanceAllAttributes.labels.sort(),
      );
    });

    it('Has plan field with parameters', async () => {
      let field = component.find('div[data-e2e-id="instance-service-plan"]');
      expect(field.exists()).toBe(true);
      expect(field.text()).toEqual(
        instanceAllAttributes.clusterServicePlan.displayName,
      );

      const button = field.find(PlanModalButton);
      button.simulate('click');
      expect(mockAddBackdrop).toHaveBeenCalled();

      field = component.find('div[data-e2e-id="instance-service-plan"]');

      const jsonCode = field.find(JSONCode);
      expect(JSON.parse(jsonCode.text())).toEqual(
        instanceAllAttributes.planSpec,
      );
    });
  });
  it('Render info without labels', () => {});
  it('Render info without support', () => {});
  it('Render info without documentation link', () => {});
  it('Render info without plan parameters', () => {});

  [
    { status: 'PROVISIONING', class: 'sys-help' },
    { status: 'FAILED', class: 'sys-cancel' },
    { status: 'RUNNING', class: 'sys-enter' },
  ].map(testCase => {
    it(`Render info with status ${testCase.status}`, () => {});
  });
});
