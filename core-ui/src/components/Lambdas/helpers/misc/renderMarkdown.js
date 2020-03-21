import React from 'react';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const markdownIt = new MarkdownIt();

export function renderMd(md) {
  if (typeof md !== 'string') {
    return md;
  }

  const html = markdownIt.render(md);
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
