import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  linkPressFeature,
  dimensionsFeature
} from 'react-native-webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  linkPressFeature.compile({ preventDefault: true }),
  dimensionsFeature.compile({ tagName: 'table' })
);

export default function EnhancedWebView(webViewProps) {
  const onLinkPress = useCallback((url) => Linking.openURL(url), []);
  const onDimensions = useCallback(
    ({ width, height }) => console.info(width, height),
    []
  );
  const onShellError = useCallback(
    // featureIdentifier == linkPressFeature.identifier
    (featureIdentifier, errorMessage) => {
      console.info(featureIdentifier, errorMessage);
    },
    []
  );
  return (
    <Webshell
      onLinkPress={onLinkPress}
      onDimensions={onDimensions}
      onShellError={onShellError}
      webViewProps={webViewProps}
    />
  );
}
