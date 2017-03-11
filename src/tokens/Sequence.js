const Token = require("./Token");



module.exports = class Sequence extends Token {

  constructor ({tokens=[]}) {
    super();
    this.tokens = tokens;
  }

  evaluate (state) {
    for (let i = 0; i < this.tokens.length && state; i++) {
      state = this.tokens[i].evaluate(state);
    }
    return state;
  }

  isValid (state) {
    for (let i = 0; i < this.tokens.length && state; i++) {
      if (!this.tokens[i].isValid(state)) return false;
    }
    return true;
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
