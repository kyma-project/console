const tabsBlockRegex = /<div tabs>(.|\n)*?<\/div>/gm;

const blankLinesRegex = /^\s*$(?:\r\n?|\n)/gm;

export const removeBlankLines = source => source.replace(blankLinesRegex, '');

export const removeBlankLinesFromTabsBlock = source =>
  source &&
  source.replace(tabsBlockRegex, occurrence => {
    return removeBlankLines(occurrence);
  });

export const putNewlineSpaceBeforeList = source => {
  //match any sequence in form (number, dot, space, character) NOT preceded by newline
  return source && source.replace(/(?<!(^\n))\d+\.\s\w/gm, arg => `\n${arg}`);
};
