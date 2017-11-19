#!/usr/bin/env bash

echo "App defaults"
node test/acceptance/example.js

echo '
expected:

dependency warn
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
'

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
