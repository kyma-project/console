import React, { useState } from 'react';
import {
  Button,
  FormSet,
  FormItem,
  FormInput,
  FormLabel,
  FormMessage,
  Icon,
  FormSelect,
} from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import { Modal } from '@kyma-project/react-components';

import InlineHelp from '../../Atoms/InlineHelp';

import { HELP, PLACEHOLDERS, TOOLTIP_DATA_ERROR } from '../../../constants';

import { AddedUrl } from './styled';

interface Props {
  configurationName?: string;
  configurations: string[];
  configurationNameField: any;
  urlField: any;
  urls: string[];
  onSubmit: (event: any) => void;
  addUrl: () => void;
  removeUrl: (url: string) => void;
  handleEnterDownOnUrlField: (e: any) => void;
  onShowModal: () => void;
  onHideModal: () => void;
}

export const Component: React.FunctionComponent<Props> = ({
  configurationName = '',
  configurations,
  configurationNameField,
  urlField,
  urls,
  onSubmit,
  addUrl,
  removeUrl,
  handleEnterDownOnUrlField,
  onShowModal,
  onHideModal,
}) => {
  const modalOpeningComponent = (
    <Button glyph="add" option="light" compact>
      Add URL
    </Button>
  );

  const addedUrls = () => {
    return urls.length
      ? urls.map(url => (
          <AddedUrl onClick={() => removeUrl(url)} key={url}>
            {url}
            <Icon glyph="decline" />
          </AddedUrl>
        ))
      : null;
  };

  const disabledConfirm = !urls.length || urlField.error;

  return (
    <Modal
      width="681px"
      title="Add URL"
      type="emphasized"
      confirmText="Add"
      cancelText="Cancel"
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={onSubmit}
      disabledConfirm={disabledConfirm}
      onShow={onShowModal}
      onHide={onHideModal}
      tooltipData={disabledConfirm ? TOOLTIP_DATA_ERROR : null}
    >
      <FormSet>
        <FormItem key="configurationName">
          <FormLabel htmlFor="configurationName" required>
            Configuration
          </FormLabel>
          <FormSelect
            id="configurationName"
            {...configurationNameField.bind}
            disabled={Boolean(configurationName)}
          >
            {configurations.map((name, idx) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </FormSelect>
        </FormItem>
        <FormItem key="url">
          <FormLabel htmlFor="url" required>
            Url
            <InlineHelp text={HELP.URL_FIELD} />
          </FormLabel>
          {addedUrls()}
          <FormInput
            id="url"
            type="text"
            placeholder={PLACEHOLDERS.URL_FIELD}
            state={urlField.checkState()}
            {...urlField.bind}
            onKeyDown={handleEnterDownOnUrlField}
          />
          {urlField.error ? (
            <FormMessage type="error">{urlField.error}</FormMessage>
          ) : null}
        </FormItem>
      </FormSet>
      <Button
        glyph="add"
        onClick={addUrl}
        option="light"
        compact
        disabled={Boolean(urlField.error || !urlField.value)}
      >
        Add URL
      </Button>
    </Modal>
  );
};

export default Component;
