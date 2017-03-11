const Token = require("./Token");



module.exports = class Constant extends Token {

  constructor ({name=""}) {
    super();
    this.name = name;
  }

  evaluate (state) {
    if (!this.isValid(state)) return;

    return state.child({
      token: this,
      offset: state.offset + this.name.length,
      args: {[this.name]: true}
    });
  }

  isValid (state) {
    return state.unmatched.indexOf(this.name) === 0;
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
