<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [react-native-webshell](./react-native-webshell.md) &gt; [AssembledFeature](./react-native-webshell.assembledfeature.md) &gt; [script](./react-native-webshell.assembledfeature.script.md)

## AssembledFeature.script property

The string containing valid ECMAScript 5 to be run in the WebView.

<b>Signature:</b>

```typescript
readonly script: string;
```

## Remarks

The script must define a single function which only argument is of the type [WebjsContext](./react-native-webshell.webjscontext.md)<!-- -->.

It is recommended that you use eslint to validate this script syntax, and event better, unit-test the script. See our repository home page for more information.

