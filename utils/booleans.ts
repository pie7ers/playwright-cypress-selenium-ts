export function parseBoolean(boolean: any): boolean {
  boolean = typeof (boolean) === 'string' ? boolean.toLowerCase() : boolean
  let myBoolean: any = {
    "true": true,
    "1": true,
    "false": false,
    "0": false
  }
  return myBoolean[boolean] || false
}