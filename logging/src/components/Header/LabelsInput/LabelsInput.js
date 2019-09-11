import React from 'react';
import PropTypes from 'prop-types';

import { Search } from '@kyma-project/react-components';
import { ComboboxInput, Menu } from 'fundamental-react/ComboboxInput';

import DropdownRenderer from './DropdownRenderer/DropdownRenderer';

import httpConfig from './../../../store/httpConfig';
import builder from './../../../store/builder';

LabelsInput.propTypes = {
  addLabel: PropTypes.func.isRequired,
  maxRecentCount: PropTypes.number,
};

LabelsInput.defaultProps = {
  maxRecentCount: 4,
};

const sampleLogLabels = [
  { name: 'Namespace', labels: ['a', 'b', 'c'] },
  { name: 'Function', labels: ['pamela', 'hasselhoff"', 'ff'] },
  { name: 'Container name', labels: ['a'] },
];

const sampleRecentLabels = ['function="pamela"', 'function="hasselhoff"'];

export default function LabelsInput({ addLabel, maxRecentCount }) {
  const [recentLabels, setRecentLabels] = React.useState(sampleRecentLabels);

  function updateRecentLabels(label) {
    if (!recentLabels.includes(label)) {
      const newRecentLabels = [...recentLabels].filter(l => l !== label);
      newRecentLabels.unshift(label);
      newRecentLabels.splice(maxRecentCount);
      setRecentLabels(newRecentLabels);
    }
  }

  function chooseLabel(label) {
    addLabel(label);
    updateRecentLabels(label);
  }

  // React.useEffect(() => {
  //   async function fetchData() {
  //     //const url = 'https://grafana.arnold.cluster.stage.faros.kyma.cx/api/datasources/proxy/2/api/prom/label/component/values?silent=true';
  //     const url = 'https://grafana.arnold.cluster.stage.faros.kyma.cx/api/datasources/proxy/2/api/prom/label/component/values';
  //     const response = await fetch(url, {
  //       headers: new Headers({
  //         Authorization: 'Bearer ' + builder.getBearerToken(),
  //       }),
  //     });
  //     console.log(response);
  //     const data = await response.json();
  //     console.log(data);
  //   }
  //   fetchData();
  // }, [
  //   /*todo*/
  // ]);

  return (
    <section>
      <span className="caption-muted">Labels</span>
      <ComboboxInput
        menu={
          <DropdownRenderer
            recentLabels={recentLabels}
            logLabels={sampleLogLabels}
            chooseLabel={chooseLabel}
          />
        }
        placeholder="Select Label"
      />
    </section>
  );
}

// getLabels(): Observable<any> {
//     return this.http.get(AppConfig.labelEndpoint, {
//       headers: this.getBaseHttpHeaders(),
//       responseType: 'text',
//     });
//   }

//   getBaseHttpHeaders() {
//     return new HttpHeaders().set(
//       'Authorization',
//       'Bearer ' + this.extractToken(),
//     );
//   }

//   extractToken(): string {
//     let idToken = '';
//     this.luigiContextService.getContext().subscribe(data => {
//       idToken = data.context.idToken;
//     });

//     return idToken;
//   }
// }
