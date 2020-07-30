[![npm](https://img.shields.io/npm/v/react-native-webshell)](https://www.npmjs.com/package/react-native-webshell)
[![semver](https://img.shields.io/badge/semver-2.0.0-e10079.svg)](https://semver.org/spec/v2.0.0.html)
[![codecov](https://img.shields.io/codecov/c/gh/jsamr/react-native-webshell)]((https://codecov.io/gh/jsamr/react-native-webshell))
[![CI](https://github.com/jsamr/react-native-webshell/workflows/CI/badge.svg?branch=master)](https://github.com/jsamr/react-native-webshell/actions?query=branch%3Amaster+workflow%3ACI)

# Webshell

A Higher-order component to handle `WebView` DOM events in `react-native`. It provides an
abstraction layer over the [dual-way message
system](https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native)
embedded in
[`react-native-webview`](https://github.com/react-native-community/react-native-webview).
Here are examples of features you can enable with this HOC:

- Intercept click events on anchors and prevent navigation (`linkPressFeature`);
- Get notified when an element size changes in the view (`dimensionsFeature`);

And you can, of course, implement any feature you'd like.

## How does it work?

It uses `WebView#injectedJavascript` prop to inject javascript “features” (snippets) responsible
for communicating information to the `Webshell` controller.

## Basic usage

This library is fairly easy to use. Just make a shell by passing the
`makeShell` function the `WebView` component and the compiled features you wish
the shell to implement. Each feature can be compiled with options, which alter
their behavior. For example, the `linkPressFeature` default behavior prevents
click events on anchors to propagate, effectively disallowing redirects. You
can, however, change this behavior to let redirects happen while still being
notified by setting `preventDefault` option to `false`.

```ts
// integration/basic.tsx

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

```

## Implementing features

To have a good sense on how to implement features, we will take a look at the
`linkPressFeature` implementation. The implementation is in typescript, which
is convenient to communicate the different types implied in a feature. There
are four important areas to specify in a feature:

1. How does it behave in the DOM? → See the content of `linkPressScript`.
2. What options can it be compiled with? → `LinkPressOptions`
3. What is the name of the event handler prop which will be available in the
   `WebShell`? → `onLinkPress`
4. What type of payload does it ship with events? → `string`

```ts
// src/features/link-press.ts

import linkPressScript from './link-press.webjs';
import { makeFeature } from '../make-feature';

export interface LinkPressOptions {
  preventDefault?: boolean;
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 */
export const linkPressFeature = makeFeature<
  LinkPressOptions,
  'onLinkPress',
  string
>({
  script: linkPressScript,
  eventHandlerName: 'onLinkPress',
  identifier: 'org.webshell.linkPress'
});

```

The behavior in the DOM is implemented in the following file (please note that
the extension is arbitrary, see the [tooling section](#tooling)):

```js
// src/features/link-press.webjs

function linkPressFeature(arg) {
  var postMessage = arg.postMessage;
  var options = arg.options || {};
  var preventDefault = options.preventDefault !== false;

  function findParent(tagname, el) {
    while (el) {
      if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  function interceptClickEvent(e) {
    var href;
    var target = e.target || e.srcElement;
    var anchor = findParent('a', target);
    if (anchor) {
      href = anchor.getAttribute('href');
      preventDefault && e.preventDefault();
      postMessage(href);
    }
  }
  document.addEventListener('click', interceptClickEvent);
}

```

To work fine, the DOM script must comply with those requirements:

1. The top level declaration file must be a function taking one argument. This
   argument is an object with the attributes `postMessage`, a function to send
   messages to the shell which will be redirected to the appropriate handler,
   and `options`, an object which has been passed during “compilation”.
2. `postMessage` must be invoked with an argument compatible with the payload
   type defined in the feature object.
3. `options` object must be compatible with the options type defined in the
   feature object.
4. The `options` object must be serializable to JSON.
5. For wide compatibility purposes, it is best to stick with ECMAScript 5
   syntax. This can be enforced with the appropriate tooling (see [tooling section](#tooling)).

**Important note**: In this project, script files are imported as string (see [tooling section](#tooling)).

<a name="tooling"></a>

## Tooling

The original idea behind this project was to perform code quality control over
scripts injected into `WebViews`, because they are parts of the codebase. To
achieve that purpose, we are using babel and eslint original plugins.

### babel

The most important thing is to use [Babel Inline
Import](https://www.npmjs.com/package/babel-plugin-inline-import) with `webjs`
or whichever extension you are using for your `WebView` scripts, see
[babel.config.js](babel.config.js) file. This plugin will allow you to import
scripts as strings instead of compiling the module!

### eslint

We are using the `overrides` feature to target `webjs` files with specific
options:

- Enforce ECMAScript 5 to make sure it runs on reasonably old `WebView`
  backends.
- Enforce a list of supported browsers with the outstanding
  [compat plugin](https://www.npmjs.com/package/eslint-plugin-compat). We make
  sure we don't use recent web APIs without a fallback or polyfill.

See our [.eslintrc.js](.eslintrc.js) file.

### Editor

The last thing you need to do is associate javascript syntax with the custom
extension you have chosen in your text editor. From nowon, you will have a full
featured QC in those scripts!