import * as React from 'react';
import { Component, ComponentType } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import featuresLoaderScript from './features-loader.webjs';
import {
  FeatureSource,
  WebshellComponentProps,
  MinimalWebViewProps,
  WebshellStaticProps
} from './types.js';

interface WebViewMessage {
  data: string;
}

interface PostMessage {
  identifier: string;
  type: 'feature' | 'error';
  body: any;
}

function parseJSONSafe(text: string) {
  try {
    return (JSON.parse(text) as PostMessage) ?? null;
  } catch (e) {
    return null;
  }
}

function serializeFeature(feature: FeatureSource) {
  return `{
    source:${feature.script},
    identifier:${JSON.stringify(feature.identifier)},
    options:${JSON.stringify(feature.options || {})}
  }`;
}

function serializeFeatureList(specs: FeatureSource[]) {
  return `[${specs.map(serializeFeature).join(',')}]`;
}

export function makeWebshell<
  W extends MinimalWebViewProps,
  F extends FeatureSource[]
>(WebView: ComponentType<W>, ...featureSources: F) {
  const serializedFeatures = serializeFeatureList(featureSources);
  const injectableScript = featuresLoaderScript.replace(
    '$$___FEATURES___$$',
    serializedFeatures
  );
  return class Webshell extends Component<WebshellComponentProps<W, F>> {
    static defaultProps = {
      webViewProps: {}
    } as WebshellComponentProps<W, F>;

    handleOnMessage = ({
      nativeEvent
    }: NativeSyntheticEvent<WebViewMessage>) => {
      const {
        webViewProps: { onMessage },
        onShellError
      } = this.props as Required<WebshellStaticProps<W>>;
      const parsedJSON = parseJSONSafe(nativeEvent.data);
      if (parsedJSON && typeof parsedJSON === 'object') {
        const { type, identifier, body } = parsedJSON;
        if (typeof type === 'string' && typeof identifier === 'string') {
          if (type === 'feature') {
            // Handle as a feature message
            const source = featureSources.find(
              (s) => s.identifier === identifier
            );
            const handlerName = source?.eventHandlerName ?? null;
            const handler =
              typeof handlerName === 'string' ? this.props[handlerName] : null;
            typeof handler === 'function' && handler(body);
            return;
          } else if (type === 'error') {
            // Handle as an error message
            typeof onShellError === 'function' &&
              onShellError(identifier, body);
            return;
          }
        }
      }
      if (typeof onMessage === 'function') {
        onMessage(nativeEvent);
      }
    };

    render() {
      const { injectedJavaScript, ...webViewProps } = this.props
        .webViewProps as W;
      const safeUserscript =
        typeof injectedJavaScript === 'string' ? injectedJavaScript : '';
      const resultingJavascript = `(function(){${safeUserscript};${injectableScript};})();true;`;
      return (
        <WebView
          {...(webViewProps as any)}
          injectedJavaScript={resultingJavascript}
          javaScriptEnabled={true}
          onMessage={this.handleOnMessage}
        />
      );
    }
  };
}
