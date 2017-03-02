const Token = require("./Token");

module.exports = class Space extends Token {

  evaluate (state) {
    let num = this.numPrefixWhitespaces(state.unmatched);

    if (num < 1) {
      // If the parent is missing or a space, continue
      if (!state.parent || state.parentType === this.type) return state;

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