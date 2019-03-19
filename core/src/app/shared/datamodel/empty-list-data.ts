export interface IEmptyListDataHeader {
  header?: {
    text?: string;
    actionButton?: { glyph: string; text: string };
  };
}

export interface IEmptyListDataBody {
  body?: {
    text?: string;
    actionButton?: { glyph: string; text: string };
  };
}

export interface IEmptyListData extends IEmptyListDataHeader, IEmptyListDataBody {}
