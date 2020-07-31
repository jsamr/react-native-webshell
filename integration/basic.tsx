import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  linkPressFeature,
  dimensionsFeature,
  DimensionsObject
} from 'react-native-webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  linkPressFeature.assemble({ preventDefault: true }),
  dimensionsFeature.assemble({ tagName: 'table' })
);

export default function EnhancedWebView(webViewProps) {
  const onLinkPress = useCallback((url: string) => Linking.openURL(url), []);
  const onDimensions = useCallback(
    ({ width, height }: DimensionsObject) => console.info(width, height),
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
