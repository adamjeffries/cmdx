"use strict";

const Token = require("./Token");
const constants = require("../constants");



module.exports = class Delimiter extends Token {

  constructor ({value=""}) {
    super();
    if (!value || typeof value !== "string") throw new TypeError(constants.ERR_VALUE_STRING);
    this.value = value;
  }

  evaluate (state) {
    if (state.unmatched.indexOf(this.value) !== 0) return;

    return state.child({
      token: this,
      offset: state.offset + this.value.length
    });
  }

  isValid (state) {
    return state.unmatched === this.value;
  }

  toString () {
    return this.value;
  }

  toJSON () {
    let json = super.toJSON();
    json.value = this.value;
    return json;
  }

};
