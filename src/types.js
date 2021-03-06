const utils = require("./utils");



function isPlainObject (o) {
  if (typeof o !== "object" || o === null) return false;

  if (typeof Object.getPrototypeOf == "function") {
    var proto = Object.getPrototypeOf(o);
    return proto === Object.prototype || proto === null;
  }

  return Object.prototype.toString.call(o) == "[object Object]";
}



let types = {

  string (value) {
    return value + "";
  },

  boolean (value) {
    value = (value + "").toLowerCase();
    if (value === "true") return true;
    if (value === "false") return false;
  },

  object (value) {
    let o = utils.parse(value + "");
    if (isPlainObject(o)) return o;
  },

  array (value) {
    let o = utils.parse(value + "");
    if (Array.isArray(o)) return o;
  },

  number (value) {
    if (!isNaN(value)) return parseFloat(value);
  },

  integer (value) {
    if (!isNaN(value)) return parseInt(value);
  },

  date () {
    // TODO
  }

};



// Aliases
types.bool = types.boolean;
types.float = types.number;
types.o = types.object;
types.hashmap = types.object;
types.hash = types.object;



module.exports = types;
