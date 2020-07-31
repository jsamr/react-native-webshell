import linkPressScript from './link-press.webjs';
import { makeFeature } from '../make-feature';
import { Feature } from '../types';

export interface LinkPressOptions {
  preventDefault?: boolean;
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 */
export const linkPressFeature: Feature<
  LinkPressOptions,
  'onLinkPress',
  string
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onLinkPress',
  identifier: 'org.webshell.linkPress'
});
