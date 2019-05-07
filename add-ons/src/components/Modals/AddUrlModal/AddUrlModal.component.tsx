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

import {
  MODAL,
  FORMS,
  HELP,
  PLACEHOLDERS,
  TOOLTIP_DATA_ERROR,
} from '../../../constants';

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

const AddUrlModalComponent: React.FunctionComponent<Props> = ({
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
    <Button glyph="add" option="light" compact={true}>
      {MODAL.ADD_URL_BUTTON_TITLE}
    </Button>
  );

  const addedUrls = () =>
    urls.length
      ? urls.map(url => (
          <AddedUrl onClick={() => removeUrl(url)} key={url}>
            {url}
            <Icon glyph="decline" />
          </AddedUrl>
        ))
      : null;

  const disabledConfirm = !urls.length || urlField.error;

  return (
    <Modal
      width="681px"
      title={MODAL.ADD_URL_MODAL_TITLE}
      type="emphasized"
      confirmText={MODAL.CONFIRM_TEXT}
      cancelText={MODAL.CANCEL_TEXT}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={onSubmit}
      disabledConfirm={disabledConfirm}
      onShow={onShowModal}
      onHide={onHideModal}
      tooltipData={disabledConfirm ? TOOLTIP_DATA_ERROR : null}
    >
      <FormSet>
        <FormItem key="configurationName">
          <FormLabel htmlFor="configurationName" required={true}>
            {FORMS.SELECT_CONFIGURATION_LABEL}
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
          <FormLabel htmlFor="url" required={true}>
            {FORMS.URL_LABEL}
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
        compact={true}
        disabled={Boolean(urlField.error || !urlField.value)}
      >
        {FORMS.ADD_URL_BUTTON}
      </Button>
    </Modal>
  );
};

export default AddUrlModalComponent;
