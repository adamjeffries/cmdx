const Token = require("./Token");

module.exports = class Constant extends Token {

  constructor ({name=""}) {
    super();
    this.name = name;
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
