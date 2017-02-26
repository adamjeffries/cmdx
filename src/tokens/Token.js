
let tokenIndex = 0;

export default class Token {

  constructor () {
    this.id = "token-" + tokenIndex++;
  }

  get type () {
    return this.constructor.name;
  }

  toString () {
    return this.type;
  }

  toJSON () {
    return {type: this.type, id: this.id};
  }

}
