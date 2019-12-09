import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from './../Modal/Modal';
import { Button } from 'fundamental-react/Button';

const ModalWithForm = ({
  performRefetch,
  sendNotification,
  title,
  button,
  confirmText,
  initialIsValid,
  children,
  className,
}) => {
  const [isValid, setValid] = useState(initialIsValid);
  const formElementRef = useRef(null);

  React.useEffect(() => {
    if (formElementRef.current) {
      const observer = new MutationObserver((a, b) => console.log(a, b));
      observer.observe(formElementRef.current, {
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [formElementRef.current]);

  const handleFormChanged = e => {
    setValid(formElementRef.current.checkValidity());
    if (typeof e.target.reportValidity === 'function') {
      // for IE
      e.target.reportValidity();
    }
  };

  const handleFormError = (title, message) => {
    sendNotification({
      variables: {
        content: message,
        title: title,
        color: '#BB0000',
        icon: 'decline',
      },
    });
  };

  const handleFormSuccess = (title, message) => {
    sendNotification({
      variables: {
        content: message,
        title: title,
        color: '#107E3E',
        icon: 'accept',
      },
    });

    performRefetch();
  };

  const onConfirm = () => {
    const form = formElementRef.current;
    if (
      typeof form.reportValidity === 'function'
        ? form.reportValidity()
        : form.checkValidity() // IE workaround; HTML validation tooltips won't be visible
    ) {
      form.dispatchEvent(new Event('submit'));
    } else {
      // explicitly prevent closing modal
      return false;
    }
  };

  const actions = (
    <>
      <Button option="light">Cancel</Button>
      <Button aria-disabled={!isValid} onClick={onConfirm} option="emphasized">
        {confirmText}
      </Button>
    </>
  );

  const modalOpeningComponent = (
    <Button glyph={button.glyph || null} option={button.option}>
      {button.text}
    </Button>
  );

  return (
    <Modal
      modalOpeningComponent={modalOpeningComponent}
      className={className}
      actions={actions}
      title={title}
    >
      {React.createElement(children.type, {
        formElementRef,
        isValid,
        onChange: handleFormChanged,
        onError: handleFormError,
        onCompleted: handleFormSuccess,
        ...children.props,
      })}
    </Modal>
  );
};

ModalWithForm.propTypes = {
  performRefetch: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  initialIsValid: PropTypes.bool,
  button: PropTypes.exact({
    text: PropTypes.string.isRequired,
    glyph: PropTypes.string,
    option: PropTypes.oneOf(['emphasized', 'light']),
  }).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
ModalWithForm.defaultProps = {
  sendNotification: () => {},
  performRefetch: () => {},
  initialIsValid: false,
};

export default ModalWithForm;
