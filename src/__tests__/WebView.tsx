/* eslint-disable dot-notation */
import * as React from 'react';
import { View } from 'react-native';
import { MinimalWebViewProps } from '../types';
import { JSDOM } from 'jsdom';

function runScriptInDOM(html: string, script: unknown, onMessage: unknown) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously'
  });
  dom.window.ReactNativeWebView = {
    postMessage: (message: any) => {
      typeof onMessage === 'function' &&
        onMessage({ nativeEvent: { data: message } });
    }
  };
  if (typeof script === 'string') {
    dom.window.eval(script);
  }
}

export default function WebView({
  injectedJavaScript,
  onMessage,
  onError,
  source
}: MinimalWebViewProps) {
  React.useEffect(() => {
    const html =
      source && typeof source === 'object' && typeof source['html'] === 'string'
        ? source['html']
        : '';
    try {
      runScriptInDOM(html, injectedJavaScript as string, onMessage);
    } catch (e) {
      typeof onError === 'function' &&
        onError(
          typeof e === 'string'
            ? e
            : typeof e === 'object' && typeof e.message === 'string'
            ? e.message
            : 'Unknown error'
        );
    }
  }, [injectedJavaScript, onMessage, onError, source]);

  return <View />;
}
