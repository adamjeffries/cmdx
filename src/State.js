/**
 * State - used to walk the Token Tree
 */
module.exports = class State {

  constructor (options) {
    options = options || {};

    this.parent = options.parent;
    this.token = options.token;
    this.input = options.input || "";
    this.offset = options.offset || 0;
    this.args = options.args || {};
    this.defaults = options.defaults || {};
    this.dataTypes = options.dataTypes || {};
  }

  child (options) {
    options = options || {};

    return new State({
      parent: this,
      token: options.token,
      input: this.input,
      offset: options.offset ? Math.min(options.offset, this.input.length) : this.offset,
      args: options.args ? Object.assign({}, this.args, options.args) : this.args,
      defaults: options.defaults ? Object.assign({}, this.defaults, options.defaults) : this.defaults,
      dataTypes: options.dataTypes || {}
    });
  }

  get unmatched () {
    return this.input.substring(this.offset);
  }

  get matched () {
    return this.input.substring(0, this.offset);
  }

  get parentType () {
    if (this.parent && this.parent.token) return this.parent.token.type;
  }

  toJSON () {
    return {
      token: this.token ? this.token.toJSON() : null,
      input: this.input,
      offset: this.offset,
      args: this.args,
      defaults: this.defaults,
      dataTypes: Object.keys(this.dataTypes)
    };
  }

  toString () {
    return JSON.stringify(this.toJSON());
  }

};
