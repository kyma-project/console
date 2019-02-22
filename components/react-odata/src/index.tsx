import React from "react";
import ReactDOM from "react-dom";
import { ODataReact } from "./ODataReact";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider, GlobalStyle } from "./theme/index";
import { defaultTheme } from "./theme/default";

ReactDOM.render(
  <ThemeProvider theme={defaultTheme}>
    <>
      <GlobalStyle />
      <ODataReact />
    </>
  </ThemeProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
