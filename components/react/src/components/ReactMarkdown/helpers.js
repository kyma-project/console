const tabsBlockRegex = /<div tabs>(.|\n)*?<\/div>/gm;

const blankLinesRegex = /^\s*$(?:\r\n?|\n)/gm;

export const removeBlankLines = source => source.replace(blankLinesRegex, '');

export const removeBlankLinesFromTabsBlock = source =>
  source &&
  source.replace(tabsBlockRegex, occurrence => {
    const result = removeBlankLines(occurrence);

    return result;
  });
