import React, { useState } from 'react';
import {
  Button,
  FormSet,
  FormItem,
  FormInput,
  FormLabel,
  FormMessage,
  Icon,
} from 'fundamental-react';
import { Modal } from '@kyma-project/react-components';

import InlineHelp from '../../Atoms/InlineHelp';

import { HELP, PLACEHOLDERS, TOOLTIP_DATA_ERROR } from '../../../constants';

import { AddedUrl, StyledToken, AddLabelButtonWrapper } from './styled';

interface Props {
  nameField: any;
  labelsField: any;
  urlField: any;
  labels: string[];
  urls: string[];
  onSubmit: (event: any) => void;
  addUrl: () => void;
  removeUrl: (url: string) => void;
  addLabel: () => void;
  removeLabel: (label: string) => void;
  handleEnterDownOnLabelsField: (e: any) => void;
  handleEnterDownOnUrlField: (e: any) => void;
  onShowModal: () => void;
  onHideModal: () => void;
  configurationsExist: boolean;
}

export const AddNewConfigurationModal: React.FunctionComponent<Props> = ({
  nameField,
  labelsField,
  urlField,
  labels,
  urls,
  onSubmit,
  addUrl,
  removeUrl,
  addLabel,
  removeLabel,
  handleEnterDownOnLabelsField,
  handleEnterDownOnUrlField,
  onShowModal,
  onHideModal,
  configurationsExist,
}) => {
  const modalOpeningComponent = (
    <Button glyph="add" disabled={!configurationsExist}>
      Add New Configuration
    </Button>
  );

  const addedLabels = () => {
    return labels.length
      ? labels.map(label => (
          <StyledToken onClick={() => removeLabel(label)} key={label}>
            {label}
          </StyledToken>
        ))
      : null;
  };

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

  const disabledConfirm =
    !urls.length ||
    nameField.error ||
    !nameField.value ||
    labelsField.error ||
    urlField.error;

  return (
    <Modal
      width="681px"
      title="New Configuration"
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
        <FormItem key="name">
          <FormLabel htmlFor="name" required>
            Name
            <InlineHelp text={HELP.NAME_FIELD} />
          </FormLabel>
          <FormInput
            id="name"
            type="text"
            placeholder={PLACEHOLDERS.NAME_FIELD}
            state={nameField.checkState()}
            {...nameField.bind}
          />
          {nameField.error ? (
            <FormMessage type="error">{nameField.error}</FormMessage>
          ) : null}
        </FormItem>
        <FormItem key="labels">
          <FormLabel htmlFor="labels">
            Labels
            <InlineHelp text={HELP.LABELS_FIELD} />
          </FormLabel>
          <FormInput
            id="labels"
            type="text"
            placeholder={PLACEHOLDERS.LABELS_FIELD}
            state={labelsField.checkState()}
            {...labelsField.bind}
            onKeyDown={handleEnterDownOnLabelsField}
          />
          {labelsField.error ? (
            <FormMessage type="error">{labelsField.error}</FormMessage>
          ) : null}
          {addedLabels()}
        </FormItem>
        <AddLabelButtonWrapper>
          <Button
            glyph="add"
            onClick={addLabel}
            option="light"
            compact
            disabled={Boolean(labelsField.error || !labelsField.value)}
          >
            Add Label
          </Button>
        </AddLabelButtonWrapper>
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
        <Button
          glyph="add"
          onClick={addUrl}
          option="light"
          compact
          disabled={Boolean(urlField.error || !urlField.value)}
        >
          Add URL
        </Button>
      </FormSet>
    </Modal>
  );
};

export default AddNewConfigurationModal;
