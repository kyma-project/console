export interface DataConverter<S, T> {
  convert(S): T;
}
