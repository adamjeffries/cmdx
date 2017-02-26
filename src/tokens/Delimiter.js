const Token = require("./Token");

module.exports = class Delimiter extends Token {

  constructor ({value=""}) {
    super();
    this.value = value;
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
