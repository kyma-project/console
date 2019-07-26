// https://docs.oasis-open.org/odata/odata-csdl-json/v4.01/csprd04/schemas/

export default {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description:
    'OData Common Schema Definition Language (CSDL) JSON Representation Version 4.01',
  additionalProperties: false,
  properties: {
    $Version: {
      description: 'OData version used in this document',
      enum: ['4.0', '4.01'],
    },
    $EntityContainer: {
      description: 'Qualified name of the entity container',
      type: 'string',
    },
    $Reference: {
      description: 'References to other CSDL documents',
      type: 'object',
      patternProperties: {
        '.*': {
          description: 'Reference Object',
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '^@': {
              $ref: '#/definitions/Annotation',
            },
          },
          properties: {
            $Include: {
              description: 'Included schemas',
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  $Namespace: {
                    description: 'Namespace to include',
                    type: 'string',
                  },
                  $Alias: {
                    description: 'Alias of included namespace',
                    type: 'string',
                  },
                },
                patternProperties: {
                  '^@': {
                    $ref: '#/definitions/Annotation',
                  },
                },
                required: ['$Namespace'],
              },
            },
            $IncludeAnnotations: {
              description: 'Included annotations',
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  $TermNamespace: {
                    description: 'Term namespace of annotations to include',
                    type: 'string',
                  },
                  $TargetNamespace: {
                    description: 'Target namespace of annotations to include',
                    type: 'string',
                  },
                  $Qualifier: {
                    description: 'Qualifier of annotations to include',
                    type: 'string',
                  },
                },
                required: ['$TermNamespace'],
              },
            },
          },
        },
      },
    },
  },
  patternProperties: {
    '^[^$]': {
      $ref: '#/definitions/Schema',
    },
  },
  definitions: {
    Schema: {
      description: 'CSDL Schema',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
        '^[^$@]*$': {
          oneOf: [
            {
              $ref: '#/definitions/EntityType',
            },
            {
              $ref: '#/definitions/ComplexType',
            },
            {
              $ref: '#/definitions/EnumType',
            },
            {
              $ref: '#/definitions/TypeDefinition',
            },
            {
              $ref: '#/definitions/Term',
            },
            {
              $ref: '#/definitions/EntityContainer',
            },
            {
              description: 'Action',
              type: 'array',
              items: {
                $ref: '#/definitions/Action',
              },
            },
            {
              description: 'Function',
              type: 'array',
              items: {
                $ref: '#/definitions/Function',
              },
            },
          ],
        },
      },
      properties: {
        $Alias: {
          description: 'Alias of CSDL Schema',
          type: 'string',
        },
        $Annotations: {
          description: 'Annotations',
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '^[^$]': {
              description: 'Annotation Target',
              type: 'object',
              additionalProperties: false,
              patternProperties: {
                '^@': {
                  $ref: '#/definitions/Annotation',
                },
              },
            },
          },
        },
      },
    },
    EntityType: {
      description: 'Entity Type',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '@': {
          $ref: '#/definitions/Annotation',
        },
        '^[^$@]*$': {
          oneOf: [
            {
              $ref: '#/definitions/Property',
            },
            {
              $ref: '#/definitions/NavigationProperty',
            },
          ],
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['EntityType'],
        },
        $HasStream: {
          description: 'Media entity type',
          type: 'boolean',
          default: true,
        },
        $Key: {
          description: 'List of key properties',
          type: 'array',
          items: {
            description: 'Key property name',
            type: ['string', 'object'],
            patternProperties: {
              '.*': {
                description: 'Key alias : path to key property',
                type: 'string',
              },
            },
          },
        },
        $Abstract: {
          description: 'Abstract entity type',
          type: 'boolean',
          default: true,
        },
        $OpenType: {
          description: 'Open entity type',
          type: 'boolean',
          default: true,
        },
        $BaseType: {
          description: 'Qualified name of base entity type',
          type: 'string',
        },
      },
      required: ['$Kind'],
    },
    ComplexType: {
      description: 'Complex Type',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '@': {
          $ref: '#/definitions/Annotation',
        },
        '^[^$@]*$': {
          oneOf: [
            {
              $ref: '#/definitions/Property',
            },
            {
              $ref: '#/definitions/NavigationProperty',
            },
          ],
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['ComplexType'],
        },
        $Abstract: {
          description: 'Abstract complex type',
          type: 'boolean',
          default: true,
        },
        $OpenType: {
          description: 'Open complex type',
          type: 'boolean',
          default: true,
        },
        $BaseType: {
          description: 'Qualified name of base complex type',
          type: 'string',
        },
      },
      required: ['$Kind'],
    },
    Property: {
      description: 'Structural Property',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of property',
          enum: ['Property'],
        },
        $Type: {
          description: 'Qualified name of primitive or complex type',
          type: 'string',
          default: 'Edm.String',
        },
        $Collection: {
          description: 'Collection-valued property',
          type: 'boolean',
          default: true,
        },
        $Nullable: {
          description: 'Nullable property',
          type: 'boolean',
          default: false,
        },
        $MaxLength: {
          $ref: '#/definitions/MaxLength',
        },
        $Unicode: {
          $ref: '#/definitions/Unicode',
        },
        $Precision: {
          $ref: '#/definitions/Precision',
        },
        $Scale: {
          $ref: '#/definitions/Scale',
        },
        $SRID: {
          $ref: '#/definitions/SRID',
        },
        $DefaultValue: {
          description: 'Default value',
        },
      },
    },
    NavigationProperty: {
      description: 'Navigation Property',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '@': {
          $ref: '#/definitions/Annotation',
        },
        '^\\$OnDelete@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of property',
          enum: ['NavigationProperty'],
        },
        $Type: {
          description: 'Qualified name of entity type',
          type: 'string',
        },
        $Collection: {
          description: 'Collection-valued navigation property',
          type: 'boolean',
          default: true,
        },
        $Nullable: {
          description: 'Minimum cardinality is zero',
          type: 'boolean',
          default: false,
        },
        $Partner: {
          description:
            'Partner navigation property leading back to this entity',
          type: 'string',
        },
        $ContainsTarget: {
          description: 'Related entities are contained in this entity',
          type: 'boolean',
          default: true,
        },
        $ReferentialConstraint: {
          type: 'object',
          patternProperties: {
            '@': {
              $ref: '#/definitions/Annotation',
            },
            '.*': {
              description: 'Dependent property : principal property',
              type: 'string',
            },
          },
        },
        $OnDelete: {
          description: 'Action on related entites when deleting this entity',
          enum: ['Cascade', 'None', 'SetNull', 'SetDefault'],
        },
      },
      required: ['$Kind', '$Type'],
    },
    EnumType: {
      description: 'Enumeration Type',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '@': {
          $ref: '#/definitions/Annotation',
        },
        '^[^$@]*$': {
          description: 'Enumeration Member : integer value',
          type: 'integer',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['EnumType'],
        },
        $IsFlags: {
          description:
            'Multiple enumeration members can be selected simultaneously',
          type: 'boolean',
          default: true,
        },
        $UnderlyingType: {
          description: 'Underlying integer type',
          enum: [
            'Edm.Byte',
            'Edm.SByte',
            'Edm.Int16',
            'Edm.Int32',
            'Edm.Int64',
          ],
          default: 'Edm.Int32',
        },
      },
      required: ['$Kind'],
    },
    TypeDefinition: {
      description: 'Type Definition',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['TypeDefinition'],
        },
        $UnderlyingType: {
          description: 'Qualified name of underlying primitive type',
          type: 'string',
        },
        $MaxLength: {
          $ref: '#/definitions/MaxLength',
        },
        $Unicode: {
          $ref: '#/definitions/Unicode',
        },
        $Precision: {
          $ref: '#/definitions/Precision',
        },
        $Scale: {
          $ref: '#/definitions/Scale',
        },
        $SRID: {
          $ref: '#/definitions/SRID',
        },
      },
      required: ['$Kind', '$UnderlyingType'],
    },
    Term: {
      description: 'Term',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['Term'],
        },
        $Type: {
          description: 'Qualified type name',
          type: 'string',
          default: 'Edm.String',
        },
        $Collection: {
          description: 'Collection-valued term',
          type: 'boolean',
          default: true,
        },
        $Nullable: {
          description: 'Nullable term',
          type: 'boolean',
          default: false,
        },
        $MaxLength: {
          $ref: '#/definitions/MaxLength',
        },
        $Unicode: {
          $ref: '#/definitions/Unicode',
        },
        $Precision: {
          $ref: '#/definitions/Precision',
        },
        $Scale: {
          $ref: '#/definitions/Scale',
        },
        $SRID: {
          $ref: '#/definitions/SRID',
        },
        $BaseTerm: {
          description: 'Qualified name of base term',
          type: 'string',
        },
        $AppliesTo: {
          description: 'Term can be applied to',
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'Action',
              'ActionImport',
              'Annotation',
              'Apply',
              'Cast',
              'Collection',
              'ComplexType',
              'EntityContainer',
              'EntitySet',
              'EntityType',
              'EnumType',
              'Function',
              'FunctionImport',
              'If',
              'Include',
              'IsOf',
              'LabeledElement',
              'Member',
              'NavigationProperty',
              'Null',
              'OnDelete',
              'Parameter',
              'Property',
              'PropertyValue',
              'Record',
              'Reference',
              'ReferentialConstraint',
              'ReturnType',
              'Schema',
              'Singleton',
              'Term',
              'TypeDefinition',
              'UrlRef',
            ],
          },
        },
        $DefaultValue: {
          description: 'Default value of term, only relevant for CSDL XML',
        },
      },
      required: ['$Kind'],
    },
    Action: {
      description: 'Action',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['Action'],
        },
        $IsBound: {
          description: 'Invoke on existing resource',
          type: 'boolean',
          default: true,
        },
        $EntitySetPath: {
          description: 'Path to entity set of result entities',
          type: 'string',
        },
        $Parameter: {
          $ref: '#/definitions/Parameter',
        },
        $ReturnType: {
          $ref: '#/definitions/ReturnType',
        },
      },
      required: ['$Kind'],
    },
    Function: {
      description: 'Function',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['Function'],
        },
        $IsBound: {
          description: 'Invoke on existing resource',
          type: 'boolean',
          default: true,
        },
        $IsComposable: {
          description:
            'Allows additional path segments or system query options',
          type: 'boolean',
          default: true,
        },
        $EntitySetPath: {
          description: 'Path to entity set of result entities',
          type: 'string',
        },
        $Parameter: {
          $ref: '#/definitions/Parameter',
        },
        $ReturnType: {
          $ref: '#/definitions/ReturnType',
        },
      },
      required: ['$Kind', '$ReturnType'],
    },
    EntityContainer: {
      description: 'Entity Container',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
        '^[^$@]*$': {
          oneOf: [
            {
              $ref: '#/definitions/EntitySet',
            },
            {
              $ref: '#/definitions/Singleton',
            },
            {
              $ref: '#/definitions/ActionImport',
            },
            {
              $ref: '#/definitions/FunctionImport',
            },
          ],
        },
      },
      properties: {
        $Kind: {
          description: 'Kind of model element',
          enum: ['EntityContainer'],
        },
        $Extends: {
          description: 'Qualified name of entity container to extend',
          type: 'string',
        },
      },
      required: ['$Kind'],
    },
    EntitySet: {
      description: 'Entity Set',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Collection: {
          description: 'Collection-valued',
          enum: [true],
        },
        $Type: {
          description: 'Qualified name of entity type',
          type: 'string',
        },
        $NavigationPropertyBinding: {
          $ref: '#/definitions/NavigationPropertyBinding',
        },
        $IncludeInServiceDocument: {
          description: 'Advertise in service document',
          type: 'boolean',
          default: false,
        },
      },
      required: ['$Collection', '$Type'],
    },
    Singleton: {
      description: 'Singleton',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Type: {
          description: 'Qualified name of entity type',
          type: 'string',
        },
        $Nullable: {
          description: 'Nullable singleton',
          type: 'boolean',
          default: false,
        },
        $NavigationPropertyBinding: {
          $ref: '#/definitions/NavigationPropertyBinding',
        },
      },
      required: ['$Type'],
    },
    ActionImport: {
      description: 'Action Import',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Action: {
          description: 'Qualified name of action',
          type: 'string',
        },
        $EntitySet: {
          description: 'Entity set of result entities',
          type: 'string',
        },
      },
      required: ['$Action'],
    },
    FunctionImport: {
      description: 'Function Import',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Function: {
          description: 'Qualified name of function',
          type: 'string',
        },
        $EntitySet: {
          description: 'Entity set of result entities',
          type: 'string',
        },
        $IncludeInServiceDocument: {
          description: 'Advertise in service document',
          type: 'boolean',
          default: true,
        },
      },
      required: ['$Function'],
    },
    NavigationPropertyBinding: {
      description: 'Navigation Property Binding',
      type: 'object',
      patternProperties: {
        '.*': {
          description:
            'Path to navigation property : path to target entity set',
          type: 'string',
        },
      },
    },
    Parameter: {
      description: 'Parameter',
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        patternProperties: {
          '^@': {
            $ref: '#/definitions/Annotation',
          },
        },
        properties: {
          $Name: {
            description: 'Parameter name',
            type: 'string',
          },
          $Type: {
            description: 'Qualified name of parameter type',
            type: 'string',
            default: 'Edm.String',
          },
          $Collection: {
            description: 'Collection-valued parameter',
            type: 'boolean',
            default: true,
          },
          $Nullable: {
            description: 'Nullable parameter',
            type: 'boolean',
            default: false,
          },
          $MaxLength: {
            $ref: '#/definitions/MaxLength',
          },
          $Unicode: {
            $ref: '#/definitions/Unicode',
          },
          $Precision: {
            $ref: '#/definitions/Precision',
          },
          $Scale: {
            $ref: '#/definitions/Scale',
          },
          $SRID: {
            $ref: '#/definitions/SRID',
          },
        },
        required: ['$Name'],
      },
    },
    ReturnType: {
      description: 'Return Type',
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^@': {
          $ref: '#/definitions/Annotation',
        },
      },
      properties: {
        $Type: {
          description: 'Qualified name of return type',
          type: 'string',
          default: 'Edm.String',
        },
        $Collection: {
          description: 'Returns a collection',
          type: 'boolean',
          default: true,
        },
        $Nullable: {
          description: 'Can return null',
          type: 'boolean',
          default: false,
        },
        $MaxLength: {
          $ref: '#/definitions/MaxLength',
        },
        $Unicode: {
          $ref: '#/definitions/Unicode',
        },
        $Precision: {
          $ref: '#/definitions/Precision',
        },
        $Scale: {
          $ref: '#/definitions/Scale',
        },
        $SRID: {
          $ref: '#/definitions/SRID',
        },
      },
    },
    MaxLength: {
      description: 'Maximum length of string or binary value',
      type: 'integer',
      minimum: 1,
    },
    Unicode: {
      description: 'Unicode values allowed',
      type: 'boolean',
      default: false,
    },
    Precision: {
      description: 'Maximum number of significant digits',
      type: 'integer',
      minimum: 0,
    },
    Scale: {
      description: 'Maximum number of fractional digits',
      oneOf: [
        {
          type: 'integer',
        },
        {
          enum: ['floating', 'variable'],
        },
      ],
    },
    SRID: {
      description:
        'Coordinate reference system as defined by the European Petroleum Survey Group',
      type: 'string',
    },
    Annotation: {
      description: 'Annotation',
    },
  },
};
