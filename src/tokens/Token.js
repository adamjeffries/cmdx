

let count = 0;

module.exports = class Token {

  constructor () {
    this.id = "token-" + count++;
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

};
