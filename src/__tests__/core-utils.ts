import espree from 'espree';

export function validateJavascript(script: string) {
  espree.parse(script, { ecmascriptVersion: 5 });
}
