// HELPER TYPES

import { ComponentType } from 'react';

export type EventNameOf<T> = T extends FeatureSource<{}, infer E, unknown>
  ? E
  : never;

export type PayloadOf<T, E extends string> = T extends FeatureSource<
  {},
  E,
  infer P
>
  ? P
  : never;

export type FeatureSourceOf<F> = F extends Feature<infer O, infer E, infer P>
  ? FeatureSource<Object, E, P>
  : never;

export type WebshellHandlerProp<
  F extends FeatureSource<{}, string, unknown>
> = {
  [E in EventNameOf<F>]?: (p: PayloadOf<F, E>) => void;
};

export type WebshellComponentOf<
  W extends MinimalWebViewProps,
  F
> = F extends Feature<{}, string, unknown>[]
  ? ComponentType<W & WebshellComponentProps<W, FeatureSourceOf<F[number]>[]>>
  : never;

// USEFUL TYPES

export interface FeatureSource<
  O extends {} = {},
  E extends string = string,
  P = any
> {
  /**
   * The script of the feature.
   */
  script: string;
  /**
   * A unique identifier of the feature. The convention is to use a reverse
   * namespace domain ending with the event name.
   *
   * @example
   * com.archriss.linkPress
   */
  identifier: string;
  /**
   * The name of the event handler. The convention is to name it `on` +
   * PascalCase event name.
   *
   * @example
   * onLinkPress
   */
  eventHandlerName: E;
  /**
   * Any value that can be serialized to JSON and deserialized.
   */
  options?: Partial<O>;
  /**
   * Placeholder value to infer P.
   */
  payloadType?: P;
}

export interface Feature<O extends {}, E extends string, P> {
  readonly identifier: string;
  readonly eventHandlerName: E;
  readonly compile: (options?: O) => FeatureSource<O, E, P>;
}

export interface WebshellStaticProps<W> {
  onShellError?: (featureIdentifier: string, error: string) => void;
  webViewProps?: W;
}

export type WebshellComponentProps<
  W,
  F extends FeatureSource<{}, string, unknown>[]
> = WebshellHandlerProp<F[number]> & WebshellStaticProps<W>;

export interface MinimalWebViewProps {
  onMessage?: unknown;
  onError?: unknown;
  injectedJavaScript?: unknown;
  javaScriptEnabled?: unknown;
}
