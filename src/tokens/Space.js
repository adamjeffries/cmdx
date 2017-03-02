const Token = require("./Token");

module.exports = class Space extends Token {

  evaluate (state) {
    let num = this.numPrefixWhitespaces(state.unmatched);

    if (num < 1) {
      // Check if the parent is a Space token - if so, continue
      if (state.parentType === this.type) return state;

    } else {
      return state.child({
        token: this,
        offset: state.offset + num
      });
    }
  }

  isValid (state) {
    return this.numPrefixWhitespaces(state.unmatched) > 0;
  }

  numPrefixWhitespaces (str) {
    let matches = (/^[\s]+/g).exec(str + "");
    if (matches && matches.length && matches[0].length) return matches[0].length;
    return 0;
  }

  toString () {
    return " ";
  }

};