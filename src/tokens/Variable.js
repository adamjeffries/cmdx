const Token = require("./Token");
const dataTypes = require("../dataTypes");
const NEXTVALUE = /^(?:[^\s"]+|"[^"]*"|[\n\t^"]+)/g;

module.exports = class Variable extends Token {

  constructor ({name="", dataType="", dotdotdot=false}) {
    super();
    this.name = name;
    this.dataType = dataType;
    this.dotdotdot = dotdotdot;
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
    if (this.dotdotdot) return {value: state.unmatched, offset: state.unmatched.length};

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
    if (state.command && this.dataType in state.command.dataTypes) {
      fn = state.command.dataTypes[this.dataType];
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
    if (this.dotdotdot) str += "...";
    return `<${str}>`;
  }

  toJSON () {
    let json = super.toJSON();
    json.name = this.name;
    json.dataType = this.dataType;
    json.dotdotdot = this.dotdotdot;
    return json;
  }

};