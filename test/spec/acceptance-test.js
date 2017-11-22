const assert = require('assert');
const path = require('path');
const {promisify} = require('util');
const child_process = require('child_process');
const exec = promisify(child_process.execFile);

describe("Acceptance", function() {
  it("App defaults are applied", async function() {
    let expected = `dependency warn
dependency error
dependency log
whiny-dependency error
whiny-dependency log
cardstack:a info
cardstack:a warn
cardstack:a error
cardstack:a log
cardstack:b info
cardstack:b warn
cardstack:b error
cardstack:b log
`;

    let {stderr} = await exec('node', [path.join(__dirname, '..', 'example.js')], {
      env: Object.assign({
        LOG_TIMESTAMPS: 'false'
      }, process.env)
    });
    assert.equal(stderr, expected);
  });

  it("Environment overrides take precedence", async function() {
    let expected = `dependency error
dependency log
whiny-dependency log
cardstack:a info
cardstack:a warn
cardstack:a error
cardstack:a log
cardstack:b trace
cardstack:b debug
cardstack:b info
cardstack:b warn
cardstack:b error
cardstack:b log
`;

    let {stderr} = await exec('node', [path.join(__dirname, '..', 'example.js')], {
      env: Object.assign({
        DEFAULT_LOG_LEVEL: 'error',
        LOG_LEVELS: 'whiny-dependency=none,cardstack:b=trace',
        LOG_TIMESTAMPS: 'false',
      }, process.env)
    });
    assert.equal(stderr, expected);
  });
});
/*

echo "With overrides"
DEFAULT_LOG_LEVEL=error LOG_LEVELS="whiny-dependency=none,cardstack:b=trace" node test/acceptance/example.js

echo '
expected:

dependency error
dependency log

whiny-dependency log

cardstack:a info
cardstack:a warn
cardstack:a error
cardstack:a log

cardstack:b trace
cardstack:b debug
cardstack:b info
cardstack:b warn
cardstack:b error
cardstack:b log
'
*/
