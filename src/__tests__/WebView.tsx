/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
import * as React from 'react';
import { View } from 'react-native';
import { MinimalWebViewProps } from '../types';

export default function WebView({
  injectedJavaScript,
  onMessage,
  onError
}: MinimalWebViewProps) {
  React.useEffect(() => {
    try {
      (function () {
        let window = {
          ReactNativeWebView: {
            postMessage: (message: any) => {
              typeof onMessage === 'function' &&
                onMessage({ nativeEvent: { data: message } });
            }
          }
        };
        let document = {};
        eval(injectedJavaScript as string);
      })();
    } catch (e) {
      typeof onError === 'function' && onError(e.message);
    }
  }, [injectedJavaScript, onMessage, onError]);

  return <View />;
}
