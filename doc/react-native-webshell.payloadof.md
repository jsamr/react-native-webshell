<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [react-native-webshell](./react-native-webshell.md) &gt; [PayloadOf](./react-native-webshell.payloadof.md)

## PayloadOf type

A lookup type to find the payload type from an assembled feature.

<b>Signature:</b>

```typescript
export declare type PayloadOf<T, E extends string> = T extends AssembledFeature<{}, E, infer P> ? P : never;
```
