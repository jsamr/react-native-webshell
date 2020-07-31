// HELPER TYPES

import { ComponentType } from 'react';

/**
 * A lookup type to find the event name from an assembled feature.
 *
 * @public
 */
export type EventNameOf<T> = T extends AssembledFeature<{}, infer E, unknown>
  ? E
  : never;

/**
 * A lookup type to find the payload type from an assembled feature.
 *
 * @public
 */
export type PayloadOf<T, E extends string> = T extends AssembledFeature<
  {},
  E,
  infer P
>
  ? P
  : never;

/**
 * A lookup type to infer the assembled feature from a feature.
 *
 * @public
 */
export type AssembledFeatureOf<F> = F extends Feature<infer O, infer E, infer P>
  ? AssembledFeature<Object, E, P>
  : never;

/**
 * A smart type which infers the prop type associated with a feature.
 *
 * @public
 */
export type WebshellHandlerProps<
  F extends AssembledFeature<{}, string, unknown>
> = {
  [E in EventNameOf<F>]?: (p: PayloadOf<F, E>) => void;
};

/**
 * A utility type to infer WebshellComponent type from a list of features.
 *
 * @example
 * ```ts
 * const Webshell: WebshellComponentOf<
 *  WebViewProps,
 *  [typeof featureA, typeof featureB]
 * >;
 * ```
 *
 * @public
 */
export type WebshellComponentOf<
  W extends MinimalWebViewProps,
  F
> = F extends Feature<{}, string, unknown>[]
  ? ComponentType<
      W & WebshellComponentProps<W, AssembledFeatureOf<F[number]>[]>
    >
  : never;

// USEFUL TYPES

/**
 * A feature with its options, ready to be consumed by {@link makeWebshell}.
 *
 * @public
 */
export interface AssembledFeature<
  O extends {} = {},
  E extends string = string,
  P = any
> {
  /**
   * The string containing valid ECMAScript 5 to be run in the WebView.
   */
  readonly script: string;
  /**
   * A unique identifier of the feature. The convention is to use a reverse
   * namespace domain ending with the event name.
   *
   * @example
   * com.archriss.linkPress
   */
  readonly identifier: string;
  /**
   * The name of the event handler. The convention is to name it `on` +
   * PascalCase event name.
   *
   * @example
   * onLinkPress
   */
  readonly eventHandlerName: E;
  /**
   * Any value that can be serialized to JSON and deserialized back.
   * This value will be passed to the top level function declared in the DOM
   * script.
   */
  readonly options?: Partial<O>;
  /**
   * Placeholder value to infer P.
   *
   * @remarks This is not required, but can help with typescript so that it
   * infers payload type P.
   */
  readonly payloadType?: P;
}

/**
 * A feature adds new behaviors to the `WebView` DOM and offers handlers on React
 * Native's side.
 *
 * @public
 */
export interface Feature<O extends {}, E extends string, P> {
  /** {@inheritDoc AssembledFeature.identifier} */
  readonly identifier: string;
  /** {@inheritDoc AssembledFeature.eventHandlerName} */
  readonly eventHandlerName: E;
  /**
   * Assemble the feature source from options. The feature source object can
   * thereafter be passed to {@link makeWebshell} utility.
   */
  readonly assemble: (options?: O) => AssembledFeature<O, E, P>;
}

/**
 * @public
 */
export interface WebshellStaticProps<W> {
  onShellError?: (featureIdentifier: string, error: string) => void;
  webViewProps?: W;
}

/**
 * @public
 */
export type WebshellComponentProps<
  W,
  F extends AssembledFeature<{}, string, unknown>[]
> = WebshellHandlerProps<F[number]> & WebshellStaticProps<W>;

/**
 * @public
 */
export interface MinimalWebViewProps {
  onMessage?: unknown;
  onError?: unknown;
  injectedJavaScript?: unknown;
  javaScriptEnabled?: unknown;
}
