const Token = require("./Token");

module.exports = class Group extends Token {

  constructor ({tokens=[], min=null, max=null}) {
    super();
    this.tokens = tokens;
    this.min = min;
    this.max = max;
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
