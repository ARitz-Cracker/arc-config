# arc-config

My own config file format. Object oriented and easy to read.

[![NPM][npm-image]][npm-url]

[![Node.js Version][node-version-image]][node-version-url]
[![Build status][build-status-image]][build-status-url]
[![Coverage Status](https://coveralls.io/repos/github/ARitz-Cracker/arc-config/badge.svg)](https://coveralls.io/github/ARitz-Cracker/arc-config)
[![License][license-image]][license-url]

## USAGE:

`npm install arc-config`

-
```js

let config = require("arc-config").decode(`
# Comments start with a '#'

key value # Keys and values are seperated by spaces

objects are amazing
objects.have properties
objects."are awesome." yes
objects."also have brackets".{
    totally my dude
}
`);

console.log(util.inspect(config));
```
Output:
```
{
    'key': 'value',
    'objects': {
        '_root': 'are amazing',
        'have': 'properties',
        'are awesome.': true,
        'also have brackets': {
            'totally': "my dude"
        }
    }
}
```

[npm-image]: https://nodei.co/npm/arc-config.png?downloads=true&downloadRank=true&stars=true
[npm-url]: https://nodei.co/npm/arc-config/

[node-version-image]: https://img.shields.io/node/v/arc-config.svg
[node-version-url]: https://nodejs.org/en/download/

[build-status-image]: https://travis-ci.org/ARitz-Cracker/arc-config.svg
[build-status-url]: https://travis-ci.org/ARitz-Cracker/arc-config

[license-image]: https://img.shields.io/npm/l/arc-config.svg?maxAge=2592000
[license-url]: LICENSE
