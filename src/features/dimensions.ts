import dimensionsScript from './dimensions.webjs';
import { makeFeature } from '../make-feature';

export interface DimensionsOptions {
  /**
   * The element to target when the DOM is loaded.
   */
  tagName: string;
  /**
   * When no elements are found matching the providing tag, should the script
   * raise an error?
   *
   * @default false
   */
  errorWhenNotFound?: boolean;
}

export interface DimensionsObject {
  width: number;
  height: number;
}

/**
 * This feature enables receiving the full width and height of an element
 * identified by `tagName` in the WebView pixels unit, including border widths,
 * but excluding margins. The first element matching the provided tagName is
 * retained. A new event will be triggered on every resize.
 */
export const dimensionsFeature = makeFeature<
  DimensionsOptions,
  'onDimensions',
  DimensionsObject
>({
  script: dimensionsScript,
  eventHandlerName: 'onDimensions',
  identifier: 'org.webshell.dimensions'
});
