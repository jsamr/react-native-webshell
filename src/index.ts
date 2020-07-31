import { makeWebshell } from './make-webshell';
export type {
  Feature,
  AssembledFeature,
  AssembledFeatureOf,
  EventNameOf,
  MinimalWebViewProps,
  PayloadOf,
  WebshellComponentOf,
  WebshellStaticProps,
  WebshellComponentProps,
  WebshellHandlerProps
} from './types';
export * from './make-feature';
export * from './features';
export { makeWebshell };
export default makeWebshell;
