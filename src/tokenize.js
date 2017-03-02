const Token = require("./tokens/Token");
const Constant = require("./tokens/Constant");
const Group = require("./tokens/Group");
const Sequence = require("./tokens/Sequence");
const Space = require("./tokens/Space");
const Variable = require("./tokens/Variable");
const Delimiter = require("./tokens/Delimiter");



function groupify (str) {

  let match, lastIndex = 0, levels = [[]], matchBrackets = /\[|]/g;

  while (match = matchBrackets.exec(str)) {
    let curLevel = levels[levels.length - 1];

    // Content between brackets
    if (lastIndex < match.index) curLevel.push(str.substring(lastIndex, match.index));

    if (match[0] === "[") { // Opened Bracket - move up a level
      let nextLevel = [];
      curLevel.push(nextLevel);
      levels.push(nextLevel);

    } else if (match[0] === "]") { // Closed Bracket - move down a level
      if (levels.length <= 1) throw "Unbalanced Group";
      levels.pop();
    }

    lastIndex = match.index + 1;
  }

  // Check if unbalanced
  if (levels.length !== 1) {
    throw "Unbalanced Group";

    // Remainder present (or no group found)
  } else if (lastIndex < str.length) {
    levels[0].push(str.substring(lastIndex, str.length));
  }

  return levels[0];
}


// Converts to: ["str ", {type: "group", items: [], min: num, max: num}, "str "] - top level is still an array
// If min or max are missing - it implies "any"
function quantify (groupified) {
  return groupified.map((item, index, arr) => {
    if (Array.isArray(item)) {
      let quantifiedGroup = {type: "group", items: quantify(item)};

      // Look ahead for quantifiers
      let nextItem = arr[index + 1];
      if (typeof nextItem === "string") {
        let sliceTo = 0;

        if (nextItem[0] == "*") { // 0+
          quantifiedGroup.min = 0;
          sliceTo = 1;

        } else if (nextItem[0] == "?") { // 0 to 1
          quantifiedGroup.min = 0;
          quantifiedGroup.max = 1;
          sliceTo = 1;

        } else if (nextItem[0] == "+") { // 1+
          quantifiedGroup.min = 1;
          sliceTo = 1;

        } else if (nextItem[0] == "{") { // {min, max}
          sliceTo = nextItem.indexOf("}") + 1;
          if (sliceTo < 0) throw "Missing quantifier closing curly brace";

          nextItem.substring(1, sliceTo - 1).split(",").forEach((n, i, arr) => {
            n = n.trim();
            if (i > 1) {
              throw "Invalid quantifier format";

            } else if (n) {
              if (isNaN(n)) throw "Quantifiers must be valid integers";
              n = Math.floor(parseFloat(n));

              if (i === 0) {
                if (n < 0) throw "Quantifier min must be greater than 0";
                quantifiedGroup.min = n;
                if (arr.length === 1) quantifiedGroup.max = n;

              } else if (i === 1) {
                if (quantifiedGroup.min ? n < quantifiedGroup.min : n <= 0) throw "Quantifier max must be greater or equal to the min";
                quantifiedGroup.max = n;
              }
            }
          });

        }

        arr[index + 1] = nextItem.substring(sliceTo);
      }

      return quantifiedGroup;
    } else {
      return item;
    }

  }).filter(i => !!i);
}


// Split strings into an array of items:
// - Constants, Delimiters, Variables, Spaces, Commas, Ors
function typify (quantifiedGroups) {
  return quantifiedGroups.map(item => {
    if (item && item.type == "group") { // Recurse Groups
      item.items = typify(item.items);
      return item;
    }

    if (typeof item != "string") throw "Unable to itemize - not a string";

    let items = [];
    let type = null; // space, variable, delimiter, constant, comma, or
    let typeStart = 0;

    // Walk the String
    item.split("").forEach((char, index) => {

      if (type == "variable" && char !== ">") {
        if (!/[a-zA-Z0-9:.]/g.test(char)) throw "Invalid variable name";
        return;
        // /^[a-zA-Z][a-zA-Z0-9:]*$/g.test("3aAsd:f9");
      }

      if (/\s/g.test(char)) { // space
        if (type !== "space") {
          if (type) items.push({type, value: item.substring(typeStart, index)});
          type = "space";
          typeStart = index;
        }

      } else if (char === ",") { // comma
        if (type) items.push({type, value: item.substring(typeStart, index)});
        type = "comma";
        typeStart = index;

      } else if (char === "|") { // or
        if (type) items.push({type, value: item.substring(typeStart, index)});
        type = "or";
        typeStart = index;

      } else if (char === "<") { // Variable start
        if (type) items.push({type, value: item.substring(typeStart, index)});
        type = "variable";
        typeStart = index + 1;

      } else if (char === ">") { // Variable stop
        if (type !== "variable") throw "Unmatched starting variable caret";

        let variable = {
          type: "variable",
          name: item.substring(typeStart, index),
          dataType: "String"
        };

        let nameSplit = variable.name.split(":");
        if (nameSplit.length > 2) throw "Invalid variable: " + name;

        // Custom Data Type
        if (nameSplit.length == 2) {
          if (nameSplit[0]) variable.dataType = nameSplit[0];
          variable.name = nameSplit[1];
        }

        // Dot dot dot
        if (variable.name.substr(-3) === "...") {
          variable.dotdotdot = true;
          variable.name = variable.name.substr(0, variable.name.length - 3);
        }

        // Empty name - use prior constant name
        if (!variable.name) {
          for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].type == "constant") {
              variable.name = items[i].value;
              break;
            }
          }
          if (!variable.name) throw "Missing variable name";
        }

        // Validate name
        if (!/[a-zA-Z0-9_-]/g.test(variable.name)) throw "Invalid variable name: " + variable.name;

        items.push(variable);
        type = null;

      } else if (/[a-zA-Z0-9_-]/g.test(char)) { // constant
        if (type !== "constant") {
          if (type) items.push({type, value: item.substring(typeStart, index)});
          type = "constant";
          typeStart = index;
        }

      } else { // delimiter
        if (type !== "delimiter") {
          if (type) items.push({type, value: item.substring(typeStart, index)});
          type = "delimiter";
          typeStart = index;
        }
      }

    });

    // Make sure variables were closed
    if (type == "variable") throw "Variable was not closed";

    // Remainder (for spaces, delimiters, and constants
    if (type) items.push({type, value: item.substring(typeStart)});

    return items;

  }).reduce((items, item) => {
    if (Array.isArray(item)) {
      return items.concat(item);
    } else {
      items.push(item);
      return items;
    }
  }, []);
}

// Converts an array of typed items into an array of tokens
function tokenify (typedItems) {

  // Cluster tokens by Commas and Ors
  let clusters = [[[]]];
  typedItems.forEach(item => {
    if (item.type === "comma") {
      clusters.push([[]]);

    } else {
      let commaCluster = clusters[clusters.length - 1];

      if (item.type === "or") {
        commaCluster.push([]);

      } else {
        let orCluster = commaCluster[commaCluster.length - 1];
        orCluster.push(item);
      }
    }
  });

  // Construct Tokens - Reduce and turn clusters into sequences/groups
  return clusters.map(commaCluster => {

    let orTokens = commaCluster.map(orCluster => {

      let sequenceTokens = orCluster.map(item => {

        if (item.type == "group") { // Recurse group items
          let tokens = tokenify(item.items);

          // If the only child of a group is another group - combine
          if (tokens.length === 1 && tokens[0] instanceof Group) {
            let min = item.min;
            let max = item.max;
            if (min === null || (tokens[0].min !== null && min > tokens[0].min)) min = tokens[0].min;
            if (max === null || (tokens[0].max !== null && max < tokens[0].max)) max = tokens[0].max;
            return tokens[0];

          } else if (tokens.length) {
            return new Group({tokens, min: item.min, max: item.max});
          }

        } else { // Basic Tokens
          switch (item.type) {
            case "space": return new Space();
            case "constant": return new Constant({name: item.value});
            case "variable": return new Variable({name: item.name, dataType: item.dataType, dotdotdot: !!item.dotdotdot});
            case "delimiter": return new Delimiter({value: item.value});
          }
        }

      }).filter(t => !!t);

      if (sequenceTokens.length > 1) {
        return new Sequence({tokens: sequenceTokens});

      } else if (sequenceTokens.length === 1) {
        return sequenceTokens[0];
      }

    }).filter(t => !!t);

    if (orTokens.length > 1) {
      return new Group({tokens: orTokens, min: 0, max: 1}); // Choose 1

    } else if (orTokens.length === 1) {
      return orTokens[0];
    }

  }).filter(t => !!t);
}



module.exports = function tokenize (usage) {

  // Empty usage gets an empty Token
  if (!usage || typeof usage !== "string") return new Token();

  // Trim the usage
  usage = usage.trim();

  // Groupify - Find groups and nested groups by brackets []
  let grouped = groupify(usage);

  // Quantify - Find group quantifiers
  let quantifiedGroups = quantify(grouped);

  // Typify - parse strings into structured items
  let typedItems = typify(quantifiedGroups);

  // Tokenify - reduce typed items into tokens
  let tokens = tokenify(typedItems);

  // If more than one token at the top level, convert to a sequence
  if (tokens.length > 1) {
    return new Sequence({tokens});

  } else if (tokens.length === 1) {
    return tokens[0];

  } else {
    return new Token();
  }
};

module.exports.groupify = groupify;
module.exports.quantify = quantify;
module.exports.typify = typify;
module.exports.tokenify = tokenify;