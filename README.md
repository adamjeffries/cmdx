# cmdx
Command Line Expressions - Construct Node.js CLI's with Ease!

# NOT READY FOR USE!!!!!!!!

Construct [Node.js](http://nodejs.org) [CLI's](https://en.wikipedia.org/wiki/Command-line_interface) with ease, inspired by Regular Expression Syntax.

## Installation

npm install cmdx

## Tutorial

This example mimics a subset of the well known `git` CLI.

1. Create `cli.js` and define the commands using `cmdx`

```js
#!/usr/bin/env node

const cmdx = require("cmdx");

let git2 = cmdx({

  name: "",
  
  version: "2.5.0",

  commands: {

    // Shorthand - key = expression and value = executable
    "status [-v | --verbose] [<pathspec>...]" () { //
      return "Checking the status I see";
    },
    
    // 
    "commit [-m <message>, --amend]{0,1} (--verbose|-v, --quiet|-q, --dry-run)" () {
    
    },
    
    "pull (--rebase|-r, --verbose|-v) (<repo> (<refspec>))": {
      args: {
        
      }
    },
    
    // Fully Qualified Command - including Option details
    `push [--all | --mirror | --tags] [--force | -f]
        [--force-with-lease[=<refname>[:<expect>]]]
        [<repository> [<refspec>...]]`: {
        
      name: "git-push - Update remote refs along with associated objects",
      description: "Updates remote refs using local refs, while sending objects necessary to complete the given refs.",
      manual: "",
      examples: {
        "push origin": "Without additional configuration, pushes the current branch...",
        "git push mothership master:satellite/master dev:satellite/dev": "Use the source ref that matches master (e.g.  refs/heads/master) ...",
      },
      options: {
        "<repository>": {
          description: "The remote repository that is destination of a push operation...",
          suggestions () {
            return ["master", "gh-pages", "release"];
          }
        },
        "<refspec>...": {
          description: "Specify what destination ref to update with what source..."
        },
        "--all": {
          description: "Push all branches (i.e. refs under refs/heads/); cannot be used with other <refspec>."
        },
        "-f, --force": {
          description: "Usually, the command refuses to update a remote ref that is not an ancestor...",
        }
      }
    }
  }

});


let response = git2.run(process.argv);

console.log(response);

```

2. Create `package.json`

```json
{
  "bin": {
    "git2": "./cli.js"
  }
}
```

3. Install globally for use in your terminal

```bash
npm install -g
```

4. 

