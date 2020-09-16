import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'fundamental-react';
import LuigiClient from '@luigi-project/client';
import { useNotification } from '../../contexts/NotificationContext';
import { Tooltip } from '../Tooltip/Tooltip';
import CustomPropTypes from '../../typechecking/CustomPropTypes';

const isFormValid = (formRef, reportValidity = false) => {
  if (!formRef || !formRef.current) return true;

  if (reportValidity && typeof formRef.current.reportValidity === 'function') {
    // for IE
    formRef.current.reportValidity();
  }

  return formRef.current.checkValidity();
};

const isJsonSchemaFormValid = formRef => {
  if (!formRef || !formRef.current) return true;

  return formRef.current.state && formRef.current.state.errors
    ? !formRef.current.state.errors.length
    : true;
};

export const ModalWithForm = ({
  performRefetch,
  sendNotification,
  title,
  button,
  renderForm,
  opened,
  customCloseAction,
  item,
  modalOpeningComponent,
  confirmText,
  invalidPopupMessage,
  ...props
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isValid, setValid] = useState(false);
  const [customValid, setCustomValid] = useState(true);
  const formElementRef = useRef(null);
  const jsonSchemaFormRef = useRef(null);
  const notificationManager = useNotification();

  useEffect(() => {
    setOpenStatus(opened);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  function checkAllForms(reportValidity = false) {
    const _isEveryFormValid =
      isFormValid(formElementRef, reportValidity) &&
      isJsonSchemaFormValid(jsonSchemaFormRef);
    if (isValid !== _isEveryFormValid) {
      setValid(_isEveryFormValid);
    }
  }

  // useEffect(() => {
  //   setTimeout(() => checkAllForms(true));
  // });

  function setOpenStatus(status) {
    if (status) {
      LuigiClient.uxManager().addBackdrop();
    } else {
      LuigiClient.uxManager().removeBackdrop();
      if (customCloseAction) {
        customCloseAction();
      }
    }
    setOpen(status);
  }

  function handleFormChanged(e) {
    setTimeout(() => checkAllForms());
    if (e.target) {
      if (e.target.getAttribute('data-ignore-visual-validation')) {
        return;
      }

      // current element validity
      const isValidFormElement = e.target.checkValidity();
      e.target.classList.toggle('is-invalid', !isValidFormElement);
    }
  }

  function handleFormError(title, message, isWarning) {
    notificationManager.notifyError({
      content: message,
      title: title,
      type: isWarning ? 'warning' : 'error',
    });
  }

  function handleFormSuccess(title, message) {
    // notificationManager.notify({
    //   content: message,
    //   title: title,
    //   color: '#107E3E',
    //   icon: 'accept',
    //   autoClose: true,
    // });

    performRefetch();
  }

  function handleFormSubmit() {
    const _isEveryFormValid =
      isFormValid(formElementRef) && isJsonSchemaFormValid(jsonSchemaFormRef);
    if (_isEveryFormValid) {
      formElementRef.current.dispatchEvent(new Event('submit'));
      setTimeout(() => setOpenStatus(false));
    }
  }

  function renderConfirmButton() {
    const disabled = !isValid || !customValid;
    const button = (
      <Button
        disabled={disabled}
        aria-disabled={disabled}
        onClick={handleFormSubmit}
        option="emphasized"
      >
        {confirmText}
      </Button>
    );

    if (invalidPopupMessage && disabled) {
      return (
        <Tooltip
          content={invalidPopupMessage}
          position="top"
          trigger="mouseenter"
          tippyProps={{
            distance: 16,
          }}
        >
          {button}
        </Tooltip>
      );
    }
    return button;
  }

  return (
    <>
      {modalOpeningComponent ? (
        <div
          style={{ display: 'contents' }}
          onClick={() => setOpenStatus(true)}
        >
          {modalOpeningComponent}
        </div>
      ) : (
        <Button
          glyph={button.glyph || null}
          aria-label={button.label || null}
          option={button.option}
          compact={button.compact || false}
          disabled={!!button.disabled}
          onClick={() => setOpenStatus(true)}
        >
          {button.text}
        </Button>
      )}
      <Modal
        {...props}
        show={isOpen}
        actions={
          <>
            <Button
              onClick={() => {
                setOpenStatus(false);
              }}
              option="light"
            >
              Cancel
            </Button>
            {renderConfirmButton()}
          </>
        }
        onClose={() => {
          setOpenStatus(false);
        }}
        title={title}
      >
        {renderForm({
          formElementRef,
          jsonSchemaFormRef,
          isValid,
          setCustomValid: isValid => {
            // revalidate rest of the form
            setValid(formElementRef.current.checkValidity());
            setCustomValid(isValid);
          },
          onChange: handleFormChanged,
          onError: handleFormError,
          onCompleted: handleFormSuccess,
          performManualSubmit: handleFormSubmit,
          item: item,
        })}
      </Modal>
    </>
  );
};

ModalWithForm.propTypes = {
  performRefetch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  renderForm: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  customCloseAction: PropTypes.func,
  item: PropTypes.object,
  modalOpeningComponent: PropTypes.node,
  confirmText: PropTypes.string,
  invalidPopupMessage: PropTypes.string,
  button: CustomPropTypes.button,
};

ModalWithForm.defaultProps = {
  performRefetch: () => {},
  confirmText: 'Create',
  invalidPopupMessage: '',
};
