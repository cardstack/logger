export function compile(str: string) {
  return new RegExp(str.split('*').map(escapeRegExp).join('.*'), 'i');
}

// https://codereview.stackexchange.com/a/153702
function escapeRegExp(string: string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function findMatch<T>(rules: ([RegExp, T])[], value: string, defaultVal: T) {
  for (let i = rules.length - 1; i >= 0; i--) {
    let rule = rules[i];
    if (rule[0].test(value)) {
      return rule[1];
    }
  }
  return defaultVal;
}
