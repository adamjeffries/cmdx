"use strict";

let count = 0;

module.exports = class Token {

  constructor () {
    this.id = "token-" + count++;
  }

  get cname () {
    return this.constructor.name;
  }

  evaluate (state) {
    return null;
  }

  isValid (state) {
    return false;
  }

  toString () {
    return this.cname;
  }

  toJSON () {
    return {cname: this.cname, id: this.id};
  }

};
