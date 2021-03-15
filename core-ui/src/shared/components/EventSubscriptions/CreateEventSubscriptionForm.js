import React, { useRef } from 'react';
import {
  FormItem,
  FormLabel,
  FormInput,
  FormFieldset,
  Icon,
} from 'fundamental-react';
import { InputWithPrefix } from 'react-shared';
import './CreateEventSubscriptionForm.scss';

const EVENT_TYPE_PREFIX = 'sap.kyma.custom.';

export default function CreateEventSubscriptionForm({
  formElementRef,
  onSubmit = _ => void 0,
  onChange,
}) {
  const eventAppInput = useRef(),
    eventTypeInput = useRef(),
    eventVersionInput = useRef();

  const inputFields = [eventAppInput, eventTypeInput, eventVersionInput];

  const eventTypeFinalInput = useRef();

  async function handleSubmit() {
    onSubmit(eventTypeFinalInput.current.value);
  }

  async function calculateEventType() {
    if (!inputFields.every(i => i.current?.value)) return; //cannot calculate value; TODO: inform user that all three fields must be valid to generate eventType

    const newValue = inputFields.map(f => f.current.value).join('.');
    eventTypeFinalInput.current.value = newValue;
  }

  async function handleEventTypeManualChange(e) {
    inputFields.forEach(i => {
      if (i.current) i.current.value = '';
    });
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      onChange={onChange}
      className="create-event-subscription-form"
    >
      <FormFieldset>
        <h2 className="fd-has-type-4">
          <Icon size="m" className="icon" glyph="process" />
          Calculate
          <span className="fd-has-font-style-italic fd-has-margin">
            {' '}
            eventType{' '}
          </span>
          field value
        </h2>

        <FormItem>
          <FormLabel
            htmlFor="event_app"
            required
            className="fd-has-display-block"
          >
            Application name
          </FormLabel>
          <FormInput
            ref={eventAppInput}
            onChange={calculateEventType}
            placeholder="Name of the application which is the source of the event"
            id="event_app"
          />
        </FormItem>
        <FormItem>
          <FormLabel
            htmlFor="event_type"
            required
            className="fd-has-display-block"
          >
            Event type
          </FormLabel>
          <FormInput
            onChange={calculateEventType}
            ref={eventTypeInput}
            placeholder="Type of the event"
            id="event_type"
          />
        </FormItem>
        <FormItem>
          <FormLabel
            htmlFor="event_version"
            required
            className="fd-has-display-block"
          >
            Event version
          </FormLabel>
          <FormInput
            onChange={calculateEventType}
            ref={eventVersionInput}
            placeholder="Version of the event"
            id="event_version"
            defaultValue="v1"
          />
        </FormItem>
      </FormFieldset>
      <div className="create-event-subscription-form--divider"></div>
      <FormFieldset>
        <h2 className="fd-has-type-4">
          <Icon size="m" className="icon" glyph="edit" />
          Enter
          <span className="fd-has-font-style-italic fd-has-margin">
            {' '}
            eventType{' '}
          </span>
          field value manually
        </h2>
        <FormItem>
          <FormLabel
            htmlFor="final_value"
            required
            className="fd-has-display-block"
          >
            eventType field value
          </FormLabel>
          <InputWithPrefix
            prefix={EVENT_TYPE_PREFIX}
            _ref={eventTypeFinalInput}
            onChange={handleEventTypeManualChange}
            required
            placeholder="The eventType value used to create the subscription"
            id="final_value"
          />
        </FormItem>
      </FormFieldset>
    </form>
  );
}
