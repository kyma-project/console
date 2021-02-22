import React from 'react';
import { Icon } from 'fundamental-react';
import { Tooltip } from 'react-shared';

export default function ServiceListItem({ service }) {
  const glyphType = toggle => (toggle ? 'accept' : 'decline');

  return (
    <Tooltip
      tippyProps={{ duration: 0 }}
      placement="left"
      content={
        <>
          APIs: <Icon glyph={glyphType(service.hasAPIs)} />
          <br />
          Events:
          <Icon glyph={glyphType(service.hasEvents)} />
        </>
      }
    >
      <span className="fd-has-color-text-4">{service.displayName}</span>
    </Tooltip>
  );
}
