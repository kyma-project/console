import { Source, Header } from '@kyma-project/documentation-component';

const toKebabCase = (str: string) => {
  const matched = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
  );
  if (matched) {
    return matched.map(x => x.toLowerCase()).join('-');
  }
  return str;
};

function getTypes(sources: Source[]): string[] {
  const types: Set<string> = new Set<string>();
  sources.map(s => {
    const data = s.data;
    if (data && data.frontmatter) {
      const { title, type } = data.frontmatter;
      types.add(type ? type : title);
    }
  });
  return Array.from(types);
}

export const postProcessingHeaders = (
  sources: Source[],
  headers: Header[],
): Header[] => {
  const processedHeaders: Header[] = [];
  const types = getTypes(sources);

  for (const type of types) {
    processedHeaders.push({
      title: type,
      id: toKebabCase(type),
      level: 0,
      children: [],
    });
  }

  headers.map(h => {
    const data = h.source && h.source.data;
    if (data && data.frontmatter) {
      const { title, type } = data.frontmatter;
      const t = type ? type : title;

      const ph = processedHeaders.find(p => p.title === t);
      if (ph && ph.children) {
        h.parent = ph;
        ph.children.push(h);
      }
    }
  });

  return processedHeaders;
};
