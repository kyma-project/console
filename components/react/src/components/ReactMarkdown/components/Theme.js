export default {
  plain: {
    backgroundColor: 'rgb(250, 250, 250)',
    color: 'rgb(11, 116, 222)',
  },
  styles: [
    {
      types: ['string'],
      style: {
        color: 'rgb(80, 161, 79)',
      },
    },
    {
      types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
      style: {
        color: 'rgb(115, 129, 145)',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: '#063289',
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id', 'property', 'function'],
      style: {
        color: 'rgb(49, 97, 179)',
      },
    },
    {
      types: ['attr-name', 'key'],
      style: {
        color: 'rgb(24, 70, 126)',
      },
    },
    {
      types: ['boolean'],
      style: {
        color: 'rgb(11, 116, 222)',
      },
    },
    {
      types: [
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
      ],
      style: {
        color: '#728fcb',
      },
    },
    {
      types: ['placeholder', 'variable'],
      style: {
        color: '#93abdc',
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['important'],
      style: {
        color: 'rgb(24, 70, 126)',
      },
    },
  ],
};
