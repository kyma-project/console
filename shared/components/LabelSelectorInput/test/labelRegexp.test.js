import { labelRegexp } from '../LabelSelectorInput';

describe('labelRegexp', () => {
  [
    'label=value',
    'label=vAlUe',
    'lAbEl=value',
    'label=valu3',
    'lab3l=value',
    'my-label=value',
    'label=my-value',
    'my_label=value',
    'label=my_value',
    'my.label=value',
    'label=my.value',
    'domain/label=value',
    'my-domain/label=value',
    'my_domain/label=value',
    'my.domain/label=value',
    'label=',
  ].forEach(label => {
    it(`matches: '${label}`, () => {
      expect(labelRegexp.test(label)).toBe(true);
    });
  });

  [
    '-label=value',
    'label-=value',
    'label=-value',
    'label=value-',
    '.label=value',
    'label.=value',
    'label=.value',
    'label=value.',
    '_label=value',
    'label_=value',
    'label=_value',
    'label=value_',
    '/label=value',
    '_domain/label=value',
    '-domain/label=value',
    '.domain/label=value',
    'domain_/label=value',
    'domain-/label=value',
    'domain./label=value',
    'domain-.io/label=value',
    'dOmAiN/label=value',
  ].forEach(label => {
    it(`doesn't match: '${label}`, () => {
      expect(labelRegexp.test(label)).toBe(false);
    });
  });
});
