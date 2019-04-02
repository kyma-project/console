import React from 'react';
import theme from './Theme';

import Highlight, { defaultProps } from 'prism-react-renderer';
function Code({ language, value, children }) {
  const code = children ? children : value;

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={code}
      language={language ? language : 'yaml'}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          <code>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

export default Code;
