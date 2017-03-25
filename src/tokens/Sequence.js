"use strict";

const Token = require("./Token");
const constants = require("../constants");



module.exports = class Sequence extends Token {

  constructor ({tokens=[]}) {
    super();
    if (!Array.isArray(tokens) || !tokens.length || !tokens.every(t => t instanceof Token)) {
      throw new TypeError(constants.ERR_TOKENS_ARRAY);
    }
    this.tokens = tokens;
  }

  evaluate (state) {
    for (let i = 0; i < this.tokens.length && state; i++) {
      state = this.tokens[i].evaluate(state);
    }
    return state;
  }

  isValid (state) {
    try {
      return !!this.evaluate(state);
    } catch (e) {}
    return false;
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
