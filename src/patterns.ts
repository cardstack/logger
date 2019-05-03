module.exports.compile = function compile(str) {
  return new RegExp(str.split('*').map(escapeRegExp).join('.*'), 'i');
};

// https://codereview.stackexchange.com/a/153702
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports.findMatch = function findMatch(rules, value, defaultVal) {
  for (let i = rules.length - 1; i >= 0; i--) {
    let rule = rules[i];
    if (rule[0].test(value)) {
      return rule[1];
    }
  }
  return defaultVal;
};
