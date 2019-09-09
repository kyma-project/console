import React from 'react';
import { Popover, Button, Counter } from 'fundamental-react';

interface Props {
  body: React.ReactNode;
  activeFiltersLength: number;
  disableIcon: boolean;
}

const FilterPopoverComponent: React.FunctionComponent<Props> = ({
  body,
  activeFiltersLength,
  disableIcon = true,
}) => {
  const control = (
    <Button glyph="filter" option="light" compact={true} disabled={disableIcon}>
      {activeFiltersLength > 0 && (
        <Counter notification={true}>{activeFiltersLength}</Counter>
      )}
    </Button>
  );

  return <Popover body={body} control={control} placement="bottom-end" />;
};

export default FilterPopoverComponent;
