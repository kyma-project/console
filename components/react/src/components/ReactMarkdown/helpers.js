const tabsBlockRegex = /<div tabs>(.|\n)*?<\/div>/gm;

const blankLinesRegex = /^\s*$(?:\r\n?|\n)/gm;

export const removeBlankLines = source => source.replace(blankLinesRegex, '');

export const removeBlankLinesFromTabsBlock = source =>
  source &&
  source.replace(tabsBlockRegex, occurrence => {
    return removeBlankLines(occurrence);
  });

export const putNewlineSpaceBeforeList = source => {
  return source && source.replace(/^1\.\s/gm, '\n1. ');
};
