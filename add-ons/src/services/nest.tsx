import React from 'react';

export default (...components: any[]) => (props: any) =>
  components.reduceRight(
    (children, Current) => <Current {...props}>{children}</Current>,
    props.children,
  );
