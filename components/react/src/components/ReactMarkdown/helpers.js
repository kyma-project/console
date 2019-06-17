const tabsBlockRegex = /<div\s+tabs\s*?(name=('|").+('|"))?\s*?>(.|\n)*?<\/div>/gm;

const blankLinesRegex = /^\s*$(?:\r\n?|\n)/gm;

export const removeBlankLines = source => source.replace(blankLinesRegex, '');

export const removeBlankLinesFromTabsBlock = source =>
  source &&
  source.replace(tabsBlockRegex, occurrence => {
    return removeBlankLines(occurrence);
  });

export const putNewlineSpaceBeforeList = source => {
  return (
    source &&
    source.replace(/.\n\d*\.\s./gm, arg => `${arg[0]}\n${arg.slice(1)}`)
  );
};
