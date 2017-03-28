![cmdx](cmdx.gif)
<p align="center"><b>Command Line Expressions</b></p>

# NOT READY FOR USE!!!!!!!!

Construct [Node.js](http://nodejs.org) [CLI's](https://en.wikipedia.org/wiki/Command-line_interface) with ease, inspired by Regular Expression Syntax.

## Installation

npm install cmdx

## Quick Start Tutorial

1. Create `math.js` and define a basic command:

```js
#!/usr/bin/env node

const cmdx = require("cmdx");

const args = cmdx
  .usage("<Number:a> <op> <Number:b> [--floor, --round]?")
  .arg("op", {values: ["+", "-", "/", "*"]})
  .parse(process.argv);
  
if (!args) return console.log("Unrecognized Command");  
  
let value, a = args.a, b = args.b;
switch (args.op) {
  case "+": value = a + b; break;
  case "-": value = a - b; break;
  case "*": value = a * b; break;
  case "/": value = a / b; break;
  default: value = 0;
}
if (args["--floor"]) value = Math.floor(value);
if (args["--round"]) value = Math.round(value);
console.log(`${a} ${op} ${b} = ${value}`);  
```

2. Create `package.json`

```json
{
  "bin": {
    "math": "./math.js"
  }
}
```

3. Install globally for use in your terminal

```bash
npm install -g
```

4. Run the math command

```bash
> math 1 + notanumber
Unrecognized Command

> math 1.2 + 2.3
3.5

> math 1.2 * 2.3 --floor
2
```
