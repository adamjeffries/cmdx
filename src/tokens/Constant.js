"use strict";

const Token = require("./Token");
const constants = require("../constants");



module.exports = class Constant extends Token {

  constructor ({name=""}) {
    super();
    if (!name || typeof name !== "string") throw new TypeError(constants.ERR_NAME_STRING);
    this.name = name;
  }

  evaluate (state) {
    if (state.unmatched.indexOf(this.name) !== 0) return;

    return state.child({
      token: this,
      offset: state.offset + this.name.length,
      args: {[this.name]: true}
    });
  }

  isValid (state) {
    return state.unmatched === this.name;
  }

  toString () {
    return this.name;
  }

  toJSON () {
    let json = super.toJSON();
    json.name = this.name;
    return json;
  }

};
