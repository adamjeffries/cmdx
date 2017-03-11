const Token = require("./Token");



module.exports = class Group extends Token {

  constructor ({tokens=[], min=null, max=null}) {
    super();
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
        return "*";

      } else if (this.min === 1) {
        return "+";

      } else if (this.min > 1) {
        return `{${this.min},}`;
      }

    } else {
      if (this.min === 0 && this.max === 1) {
        return "?";

      } else if (this.min === this.max) {
        return `{${this.min}}`;

      } else if (this.min === null) {
        return `{,${this.max}}`;

      } else {
        return `{${this.min},${this.max}}`;
      }
    }

    return "";
  }

  toString () {
    return `[${this.tokens.map(t => t.toString()).join(",")}]${this.quantifier}`;
  }

  toJSON () {
    let json = super.toJSON();
    json.tokens = this.tokens.map(t => t.toJSON());
    json.min = this.min;
    json.max = this.max;
    return json;
  }

};
