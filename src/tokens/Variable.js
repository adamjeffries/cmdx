"use strict";

const Token = require("./Token");
const dataTypes = require("../dataTypes");
const constants = require("../constants");
const NEXTVALUE = /^(?:[^\s"]+|"[^"]*"|[\n\t^"]+)/g;



module.exports = class Variable extends Token {

  constructor ({name="", dataType="", remainder=false}) {
    super();
    if (!name || typeof name !== "string") throw new TypeError(constants.ERR_NAME_STRING);
    this.name = name;
    this.dataType = dataType;
    this.remainder = remainder;
  }

  evaluate (state) {
    let next = this.getNext(state);
    if (!next) return;

    let formatted = this.formatValue(next.value, state);
    if (typeof formatted === "undefined") return;

    return state.child({
      token: this,
      offset: state.offset + next.offset,
      args: {[this.name]: formatted}
    });
  }

  isValid (state) {
    try {
      return typeof this.formatValue(this.getNext(state).value, state) !== "undefined";
    } catch (e) {
      return false;
    }
  }

  getNext (state) {
    if (this.remainder) return {value: state.unmatched, offset: state.unmatched.length};

    // Match value before the next space (or between quotes)
    let match = state.unmatched.match(NEXTVALUE);
    if (!match || !match[0]) return;
    let value = match[0];
    let offset = value.length;
    if (value[0] === "\"" && value[value.length - 1] === "\"") value = value.slice(1, -1);
    return {value, offset};
  }

  formatValue (value, state) {
    let fn = dataTypes[this.dataType.toLowerCase()];
    if (state.dataTypes && this.dataType in state.dataTypes) {
      fn = state.dataTypes[this.dataType];
    }

    if (fn instanceof Function) {
      return fn.call(state, value);
    } else {
      throw "Unrecognized dataType: " + this.dataType;
    }
  }

  toString () {
    let str = this.name;
    if (this.dataType !== "String") str = this.dataType + ":" + str;
    if (this.remainder) str += constants.VARIABLE_REMAINDER;
    return `<${str}>`;
  }

  toJSON () {
    let json = super.toJSON();
    json.name = this.name;
    json.dataType = this.dataType;
    json.remainder = this.remainder;
    return json;
  }

};
