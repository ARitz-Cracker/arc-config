# arc-config

My own config file format. Object oriented and easy to read.

## USAGE:

`npm install arc-config`

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
