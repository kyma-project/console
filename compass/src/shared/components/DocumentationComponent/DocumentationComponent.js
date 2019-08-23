import React from "react";
import { GenericComponent } from '@kyma-project/generic-documentation';

function DocumentationComponent() {
  
  return (
    <GenericComponent layout="catalog-ui" docsTopic={{
      name: "test",
      assets: [{
        type: "md",
        files: [{
          url: "https://raw.githubusercontent.com/kyma-project/console/master/README.md"
        }]
      }]
    }}/>
  );
}

export default DocumentationComponent;