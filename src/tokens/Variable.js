const Token = require("./Token");

module.exports = class Variable extends Token {

  constructor ({name="", dataType="", dotdotdot=false}) {
    super();
    this.name = name;
    this.dataType = dataType;
    this.dotdotdot = dotdotdot;
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