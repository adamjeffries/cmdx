"use strict";

const Token = require("./Token");
const constants = require("../constants");



module.exports = class Group extends Token {

  constructor ({tokens=[], min=null, max=null}) {
    super();
    if (!Array.isArray(tokens) || !tokens.length || !tokens.every(t => t instanceof Token)) {
      throw new TypeError(constants.ERR_TOKENS_ARRAY);
    }
    this.tokens = tokens;
    this.min = min;
    this.max = max;
  }

  evaluate (state) {
    let lastMatch;
    let match = {state, tokens: this.tokens};
    let numMatches = 0;
    do {
      lastMatch = match;
      match = this.match(match);
      numMatches++;
      if (this.max && numMatches >= this.max) return match.state;
    } while (match);

    state = match ? match.state : lastMatch.state;

    if (this.min === null || typeof this.min === "undefined" || numMatches >= this.min) return state;
  }

  isValid (state) {
    try {
      return !!this.evaluate(state);
    } catch (e) {}
    return false;
  }

  match (match) {
    for (let i = 0; i < match.tokens.length; i++) {
      let nextState = match.tokens[i].evaluate(match.state);
      if (nextState) {
        let matchedTokens = match.tokens.slice(0);
        matchedTokens.splice(i, 1);
        return {state: nextState, tokens: matchedTokens};
      }
    }
  }

  get quantifier () {
    if (!this.max) {
      if (this.min === 0) {
        return constants.QUANTIFIER_ZEROPLUS;

      } else if (this.min === 1) {
        return constants.QUANTIFIER_ONEPLUS;

      } else if (this.min > 1) {
        return constants.QUANTIFIER_START + this.min + constants.QUANTIFIER_DIVIDER + constants.QUANTIFIER_END;
      }

    } else {
      if (this.min === 0 && this.max === 1) {
        return constants.QUANTIFIER_ZEROORONE;

      } else if (this.min === this.max) {
        return constants.QUANTIFIER_START + this.min + constants.QUANTIFIER_END;

      } else if (this.min === null) {
        return constants.QUANTIFIER_START + constants.QUANTIFIER_DIVIDER + this.max + constants.QUANTIFIER_END;

      } else {
        return constants.QUANTIFIER_START + this.min + constants.QUANTIFIER_DIVIDER + this.max + constants.QUANTIFIER_END;
      }
    }

    return "";
  }

  toString () {
    return constants.GROUP_START +
      this.tokens.map(t => t.toString()).join(constants.GROUP_DIVIDER) +
      constants.GROUP_END +
      this.quantifier;
  }

  toJSON () {
    let json = super.toJSON();
    json.tokens = this.tokens.map(t => t.toJSON());
    json.min = this.min;
    json.max = this.max;
    return json;
  }

};
