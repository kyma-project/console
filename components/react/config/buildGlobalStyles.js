import { css } from 'styled-components';
function buildGlobalStyles() {
  return css`
    @font-face {
      font-family: 'SAP-icons';
      src: local('SAP-icons'), url('fonts/SAP-icons.woff2') format('woff2'),
        url('/fonts/SAP-icons.woff') format('woff'),
        url('/fonts/SAP-icons.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: '72';
      font-style: normal;
      font-weight: 400;
      src: local('72'), url('fonts/72-Regular.woff2') format('woff2'),
        url('fonts/72-Regular.woff') format('woff');
    }

    @font-face {
      font-family: '72';
      font-style: normal;
      font-weight: 700;
      src: local('72-Bold'), url('fonts/72-Bold.woff2') format('woff2'),
        url('fonts/72-Bold.woff') format('woff');
    }
  `;
}

export default buildGlobalStyles;
