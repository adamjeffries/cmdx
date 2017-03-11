const tokenize = require("./tokenize");
const State = require("./State");



module.exports = class Command {

  constructor (options) {
    if (typeof options == "string") options = {usage: options};

    Object.assign(this, {
      usage: "",
      dataTypes: {},
      args: {},
      defaults: {},
      name: "",
      description: "",
      help: "",
      reserved: false,
      action: () => {}
    }, options || {});

    this.token = tokenize(this.usage);
  }

  evaluate (state) {
    if (!this.token || !state) return;
    if (typeof state === "string") {
      state = new State({dataTypes: this.dataTypes, input: state.trim()});
    }
    if (!(state instanceof State)) return;
    state = this.token.evaluate(state);
    if (!state || state.unmatched) return;
    return state;
  }

  parse (input) {
    try {
      let state = this.evaluate(input);
      if (state) return Object.assign({}, state.defaults, state.args);
    } catch (e) {}
    return {};
  }

  isValid (input) {
    if (this.token) return this.token.isValid(str);
    return false;
  }

};
