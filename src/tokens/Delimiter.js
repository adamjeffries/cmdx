const Token = require("./Token");

module.exports = class Delimiter extends Token {

  constructor ({value=""}) {
    super();
    this.value = value;
  }

  evaluate (state) {
    if (!this.isValid(state)) return;

    return state.child({
      token: this,
      offset: state.offset + this.value.length
    });
  }

  isValid (state) {
    return state.unmatched.indexOf(this.value) === 0;
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
