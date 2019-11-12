import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import { useNotification } from '../../contexts/NotificationContext'; //contexts/notifications';

//TODO: move this component to a shared "place"

const ModalWithForm = ({
  performRefetch,
  sendNotification,
  title,
  button,
  renderForm,
  item,
  ...props
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isValid, setValid] = useState(false);
  const formElementRef = useRef(null);
  const notificationManager = useNotification();

  function setOpenStatus(status) {
    if (status) {
      LuigiClient.uxManager().addBackdrop();
    } else {
      LuigiClient.uxManager().removeBackdrop();
    }
    setOpen(status);
    console.log('formElementRef.current', formElementRef.current);
  }

  useEffect(() => {
    console.log('formElementRef', formElementRef);
    if (formElementRef && formElementRef.current) {
      formElementRef.current.checkValidity();
      console.log(
        'formElementRef',
        formElementRef.current.checkValidity(),
        formElementRef.current.reportValidity(),
        formElementRef,
        'formValues',
      );
    }
  });
  function handleFormChanged(e) {
    console.log(
      'handleFormChanged formElementRef.current',
      formElementRef.current,
    );
    setValid(formElementRef.current.checkValidity()); // general form validity
    if (typeof e.target.reportValidity === 'function') {
      // for IE
      e.target.reportValidity();
    }

    if (e.target.getAttribute('data-ignore-visual-validation')) {
      return;
    }

    // current element validity
    if (e.target.checkValidity()) {
      e.target.classList.remove('is-invalid');
    } else {
      e.target.classList.add('is-invalid');
    }
  }

  function handleFormError(title, message, isWarning) {
    notificationManager.notify({
      content: message,
      title: title,
      color: isWarning ? '#E9730C' : '#BB0000',
      icon: 'decline',
      autoClose: false,
    });
  }

  function handleFormSuccess(title, message) {
    notificationManager.notify({
      content: message,
      title: title,
      color: '#107E3E',
      icon: 'accept',
      autoClose: true,
    });

    performRefetch();
  }

  function handleFormSubmit() {
    const form = formElementRef.current;
    if (
      form &&
      form.reportValidity &&
      (typeof form.reportValidity === 'function'
        ? form.reportValidity()
        : form.checkValidity()) // IE workaround; HTML validation tooltips won't be visible
    ) {
      form.dispatchEvent(new Event('submit'));
      setTimeout(() => setOpenStatus(false));
    }
  }

  return (
    <div>
      <Button
        glyph={button.glyph || null}
        onClick={() => {
          setOpenStatus(true);
        }}
      >
        {button.text}
      </Button>
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
            <Button
              aria-disabled={!isValid}
              onClick={handleFormSubmit}
              option="emphasized"
            >
              Create
            </Button>
          </>
        }
        onClose={() => {
          setOpenStatus(false);
        }}
        title={title}
      >
        {renderForm({
          formElementRef,
          isValid,
          onChange: handleFormChanged,
          onError: handleFormError,
          onCompleted: handleFormSuccess,
          performManualSubmit: handleFormSubmit,
          item: item,
        })}
      </Modal>
    </div>
  );
};

ModalWithForm.propTypes = {
  performRefetch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  button: PropTypes.exact({
    text: PropTypes.string.isRequired,
    glyph: PropTypes.string,
  }).isRequired,
  renderForm: PropTypes.func.isRequired,
  item: PropTypes.object,
};
ModalWithForm.defaultProps = {
  performRefetch: () => {},
};

export default ModalWithForm;
