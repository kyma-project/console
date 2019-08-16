import React, { useState, useEffect } from 'react';
import {
  DC,
  Sources,
  Plugins,
  RenderEngines,
  Renderers,
} from '@kyma-project/documentation-component';
import { plugins as markdownPlugins } from '@kyma-project/dc-markdown-render-engine';

import { markdownRE, openApiRE, asyncApiRE, odataRE } from './render-engines';
import { ContentUILayout, CatalogUILayout, InstancesUILayout } from './layouts';
import { MarkdownSingleRenderer } from './renderers';
import {
  disableInternalLinksMutationPlugin,
  replaceImagePathsMutationPlugin,
  removeHrefFromMarkdown,
} from './render-engines/markdown/plugins';
import { loader, ClusterDocsTopic, DocsTopic } from './loader';
import { disableClickEventFromSwagger } from './helpers';
import {
  headingPrefix,
  customFirstNode,
} from './render-engines/markdown/helpers';

const PLUGINS: Plugins = [
  markdownPlugins.frontmatterMutationPlugin,
  markdownPlugins.replaceAllLessThanCharsMutationPlugin,
  {
    plugin: markdownPlugins.headersExtractorPlugin,
    options: {
      headerPrefix: headingPrefix,
      customFirstNode,
    },
  },
  markdownPlugins.tabsMutationPlugin,
  replaceImagePathsMutationPlugin,
  disableInternalLinksMutationPlugin,
  removeHrefFromMarkdown,
];

const RENDER_ENGINES: RenderEngines = [
  markdownRE,
  openApiRE,
  asyncApiRE,
  odataRE,
];

const RENDERERS: Renderers = {
  single: [MarkdownSingleRenderer],
};

function renderContent(type: LayoutType, props?: any): React.ReactNode {
  switch (type) {
    case LayoutType.CONTENT_UI: {
      return <ContentUILayout renderers={RENDERERS} />;
    }
    case LayoutType.CATALOG_UI: {
      return <CatalogUILayout {...props} renderers={RENDERERS} />;
    }
    case LayoutType.INSTANCES_UI: {
      return <InstancesUILayout {...props} renderers={RENDERERS} />;
    }
    default:
      return null;
  }
}

export enum LayoutType {
  CONTENT_UI = 'content-ui',
  CATALOG_UI = 'catalog-ui',
  INSTANCES_UI = 'instances-ui',
}

export interface GenericComponentProps {
  docsTopic: ClusterDocsTopic | DocsTopic;
  layout?: LayoutType;
  additionalTabs?: Array<{
    label: string;
    content: React.ReactNode;
  }>;
  tabRouteHandler?: object;
}

export const GenericComponent: React.FunctionComponent<
  GenericComponentProps
> = ({ docsTopic, layout = LayoutType.CONTENT_UI, ...others }) => {
  if (!docsTopic) {
    return null;
  }

  useEffect(() => {
    disableClickEventFromSwagger();
  }, []);

  const [sources, setSources] = useState<Sources>([]);
  useEffect(() => {
    const fetchAssets = async () => {
      loader.setDocsTopic(docsTopic);
      loader.setSortServiceClassDocumentation(layout !== LayoutType.CONTENT_UI);
      await loader.fetchAssets();
      setSources(loader.getSources(layout !== LayoutType.CONTENT_UI));
    };
    fetchAssets();
  }, [docsTopic]);

  if (!sources || !sources.length) {
    return null;
  }

  return (
    <DC.Provider
      sources={sources}
      plugins={PLUGINS}
      renderEngines={RENDER_ENGINES}
    >
      {renderContent(layout, others)}
    </DC.Provider>
  );
};
