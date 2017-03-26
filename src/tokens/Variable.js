"use strict";

const Token = require("./Token");
const types = require("../types");
const constants = require("../constants");
const NEXTVALUE = /^(?:[^\s"]+|"[^"]*"|[\n\t^"]+)/g;



module.exports = class Variable extends Token {

  constructor (options) {
    super();

    Object.assign(this, {
      name: "",
      type: "string", // function or string type
      remainder: false,
      default: null,
      values: [],
      test: () => true
    }, options || {});

    if (!this.name || typeof this.name !== "string") throw new TypeError(constants.ERR_NAME_STRING);
  }

  evaluate (state) {
    let next = this.getNext(state);
    if (!next) return;

    let formatted = this.formatValue(next.value, state);
    if (typeof formatted === "undefined") return;

    let offset = state.offset + next.offset;
    let args = {};
    args[this.name] = formatted;

    return state.child({token: this, offset, args});
  }

  isValid (state) {
    try {
      let next = this.getNext(state);
      return next.offset === state.unmatched.length &&
        typeof this.formatValue(next.value, state) !== "undefined";
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

    // Format the value by type
    try {
      if (typeof this.type === "function") {
        value = this.type(value);

      } else if (typeof this.type === "string") {
        let lowerType = this.type.toLowerCase();
        if (lowerType in types) {
          value = types[lowerType](value);

        } else if (this.type in state.types && typeof state.types[this.type] === "function") {
          value = state.types[this.type](value);
        } else {
          throw "Unrecognized type: " + this.type;
        }
      } else if (this.type) {
        throw "Invalid type: must be a string or function"
      }
    } catch (e) {
      return;
    }

    // Check if in values
    if (this.values && this.values.length && this.values.indexOf(value) === -1) return;

    // Run a test
    if (typeof this.test === "function") {
      try {
        if (this.test.call(state, value) !== true) return;
      } catch (e) {
        return;
      }
    }

    // Return the formatted value
    return value;
  }

  toString () {
    let str = this.name;
    if (typeof this.type === "function") {
      str = "custom:" + str;
    } else if (typeof this.type === "string" && this.type.toLowerCase() !== "string") {
      str = this.type + ":" + str;
    }
    if (this.remainder) str += constants.VARIABLE_REMAINDER;
    return `<${str}>`;
  }

  toJSON () {
    let json = super.toJSON();
    json.name = this.name;
    json.type = typeof this.type === "string" ? this.type : "custom";
    if (this.values.length) json.values = this.values.slice(0);
    if (this.default !== null) json.default = this.default;
    json.remainder = this.remainder;
    return json;
  }

};
