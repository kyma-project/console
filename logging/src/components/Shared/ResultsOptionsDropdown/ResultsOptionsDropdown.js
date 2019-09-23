import React, { useContext } from 'react';
import './ResultOptionsDropdown.scss';
import { SearchParamsContext } from '../../Logs/SearchParams.reducer';
import {
  Popover,
  Button,
  FormLabel,
  FormInput,
  FormItem,
  FormSet,
} from 'fundamental-react';

export default function ResultOptionsDropdown() {
  const [state, actions] = useContext(SearchParamsContext);

  const PopoverContent = () => (
    <FormSet id="result-options">
      <FormItem className="fd-has-margin-small">
        <FormInput
          type="checkbox"
          id="previous-logs"
          defaultChecked={state.showPreviousLogs}
          onChange={e => actions.setShowPreviousLogs(e.target.checked)}
        />
        <FormLabel
          className="caption-muted fd-has-margin-left-tiny"
          htmlFor="previous-logs"
        >
          logs of previous lambda version
        </FormLabel>
      </FormItem>
      <FormItem className="fd-has-margin-small">
        <FormInput
          type="checkbox"
          id="health-checks"
          defaultChecked={state.showHealthChecks}
          onChange={e => actions.setShowHealthChecks(e.target.checked)}
        />
        <FormLabel
          className="caption-muted fd-has-margin-left-tiny"
          htmlFor="health-checks"
        >
          health checks
        </FormLabel>
      </FormItem>
    </FormSet>
  );

  return (
    <span className="link-button fd-has-type-minus-1">
      <Popover
        body={<PopoverContent />}
        control={
          <Button
            glyph="action-settings"
            option="light"
            className="fd-has-margin-right-tiny"
            size="xs"
          ></Button>
        }
        placement="bottom-end"
      />
    </span>
  );
}
