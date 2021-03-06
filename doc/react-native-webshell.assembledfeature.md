<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [react-native-webshell](./react-native-webshell.md) &gt; [AssembledFeature](./react-native-webshell.assembledfeature.md)

## AssembledFeature interface

A feature with its options, ready to be consumed by [makeWebshell()](./react-native-webshell.makewebshell.md)<!-- -->.

<b>Signature:</b>

```typescript
export interface AssembledFeature<O extends {} = {}, E extends string = string, P = any> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [eventHandlerName](./react-native-webshell.assembledfeature.eventhandlername.md) | E | The name of the event handler. The convention is to name it <code>on</code> + PascalCase event name. |
|  [identifier](./react-native-webshell.assembledfeature.identifier.md) | string | A unique identifier of the feature. The convention is to use a reverse namespace domain ending with the event name. |
|  [options](./react-native-webshell.assembledfeature.options.md) | Partial&lt;O&gt; | Any value that can be serialized to JSON and deserialized back. This value will be passed to the top level function declared in the DOM script. |
|  [payloadType](./react-native-webshell.assembledfeature.payloadtype.md) | P | Placeholder value to infer P. |
|  [script](./react-native-webshell.assembledfeature.script.md) | string | The string containing valid ECMAScript 5 to be run in the WebView. |

