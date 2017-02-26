const Token = require("./Token");

module.exports = class Sequence extends Token {

  constructor ({tokens=[]}) {
    super();
    this.tokens = tokens;
  }

  toString () {
    return this.tokens.map(t => t.toString()).join("");
  }

  toJSON () {
    let json = super.toJSON();
    json.tokens = this.tokens.map(t => t.toJSON());
    return json;
  }

};