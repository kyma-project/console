import * as styledComponents from "styled-components";

import { ThemeInterface } from "./types";

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>;

export { styled, css, createGlobalStyle, ThemeProvider };
