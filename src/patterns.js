module.exports.compile = function compile(str) {
  return new RegExp(str.split('*').map(escapeRegExp).join('.*'), 'i');
};

// https://codereview.stackexchange.com/a/153702
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
