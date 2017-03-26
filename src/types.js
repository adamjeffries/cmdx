const utils = require("./utils");



function isPlainObject (o) {
  if (typeof o !== "object" || o === null) return false;

  if (typeof Object.getPrototypeOf == "function") {
    var proto = Object.getPrototypeOf(o);
    return proto === Object.prototype || proto === null;
  }

  return Object.prototype.toString.call(o) == "[object Object]";
}



let dataTypes = {

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
    if (isNaN(value)) return;
    return parseFloat(value);
  },

  integer (value) {
    if (isNaN(value)) return;
    return parseInt(value);
  }

};



// Aliases
dataTypes.bool = dataTypes.boolean;
dataTypes.float = dataTypes.number;
dataTypes.o = dataTypes.object;
dataTypes.hashmap = dataTypes.object;
dataTypes.hash = dataTypes.object;



module.exports = dataTypes;
