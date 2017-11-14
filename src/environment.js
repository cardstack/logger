module.exports.parseLevelList = function parseLevelList(str) {
  return str.split(',').map(function(pair) {
    return pair.split('=');
  });
};
