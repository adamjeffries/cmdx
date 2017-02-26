import Token from "./Token";

export default class Delimiter extends Token {

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

}