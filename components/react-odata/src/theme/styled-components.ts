import {
  default as styledComponents,
  ThemedStyledComponentsModule,
} from "styled-components";

import { ThemeInterface } from "./types";

const {
  default: styled,
  css,
  ThemeProvider,
} = styledComponents as ThemedStyledComponentsModule<ThemeInterface>;
