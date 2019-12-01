# json-args

`npm i @toolia/json-args`

Use `-g` flag if you need to install it as a command line tool.

Process arguments passed to your node script as JSON.

It can be used as either a command line tool, or in a module.

### As a command line tool

`json-args --category=tool`

will output a json string: `{"category":"tool"}`

Another example:

`json-args --category=tool --description="process command line arguments"`

will output:

`{"category":"tool","description":"process command line arguments"}`

### As a module

```
// myScript.js
const jsonArgs = require("@toolia/json-args").default;

console.log(JSON.stringify(jsonArgs(process.argv.slice(2))));
```

When the above script is called e.g. `node myScript --hello`,
it would output
`{"hello":true}`

---

- Arguments do not need to be specified with `--`.

- You can specify either a .json file or raw JSON string as the first argument which will be parsed as the default json.
