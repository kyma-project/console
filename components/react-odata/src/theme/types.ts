import { FlattenSimpleInterpolation } from "styled-components";

type styledString = string | FlattenSimpleInterpolation;

export interface ThemeInterface {
  code?: styledString;
  table?: styledString;
  show?: boolean;
}
