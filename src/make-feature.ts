import { Feature } from './types';

export function makeFeature<O extends {}, E extends string, P>({
  script,
  identifier,
  eventHandlerName,
  payloadType
}: {
  script: string;
  identifier: string;
  eventHandlerName: E;
  payloadType?: P;
}): Feature<O, E, P> {
  return {
    identifier,
    eventHandlerName,
    compile: (options: Partial<O> = {}) => ({
      script,
      identifier,
      eventHandlerName,
      payloadType,
      options: options
    })
  };
}
