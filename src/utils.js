/**
 * JS Object Literal Notation (JSON without key quotes)
 *
 * @example
 *   let o = parse("{a: 1}");
 */
function parse (str) {
  if (typeof str !== "string") return null;

  // Cleanup Whitespace
  str = str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");

  // Regex from http://json.org/json2.js
  if (/^[\],:{}\s]*$/.test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ":")
      .replace(/\w*\s*\:/g, ":"))) {
    return (new Function("return " + str))();

  } else {
    throw "Unable to Parse: " + str;
  }
}



module.exports = {parse};
