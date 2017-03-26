"use strict";

const expect = require("expect.js");
const State = require("../../src/State.js");
const Variable = require("../../src/tokens/Variable");



describe("Variable", function () {

  let v1 = new Variable({name: "world"});
  let v2 = new Variable({name: "age", type: "number"});
  let v3 = new Variable({name: "name", type (val) { return val + "!"; }});
  let v4 = new Variable({name: "state", values: ["AL", "FL", "CA", "WA"], default: "IL"});
  let v5 = new Variable({name: "range", type: "number", test: v => v >= 0 && v <= 10});
  let v6 = new Variable({name: "settings", type: "object", remainder: true});


  it("Exposes Options", function () {
    expect(v2.name).to.be("age");
    expect(v4.values.length).to.be(4);
    expect(v5.type).to.be("number");
    expect(v6.remainder).to.be(true);
  });

  it("Can Stringify", function () {
    expect(v1.toString()).to.be("<world>");
    expect(v2.toString()).to.be("<number:age>");
    expect(v3.toString()).to.be("<custom:name>");
    expect(v4.toString()).to.be("<state>");
    expect(v5.toString()).to.be("<number:range>");
    expect(v6.toString()).to.be("<object:settings...>");
  });

  it("Can convert to JSON", function () {
    let j1 = v1.toJSON();
    expect(j1.id).to.be.a("string");
    expect(j1.name).to.be("world");
    expect(j1.cname).to.be("Variable");
    expect(j1.values).to.not.be.ok();
    expect(j1.remainder).to.be(false);
    expect(j1.default).to.not.be.ok();

    let j4 = v4.toJSON();
    expect(j4.id).to.be.a("string");
    expect(j4.name).to.be("state");
    expect(j4.cname).to.be("Variable");
    expect(j4.values.length).to.be(4);
    expect(j4.remainder).to.be(false);
    expect(j4.default).to.be("IL");
  });

  it("Can Validate", function () {
    expect(v1.isValid(new State({input: ""}))).to.be(false);
    expect(v1.isValid(new State({input: "hello"}))).to.be(true);
    expect(v1.isValid(new State({input: "hello world"}))).to.be(false);

    expect(v2.isValid(new State({input: "one"}))).to.be(false);
    expect(v2.isValid(new State({input: "123"}))).to.be(true);
    expect(v2.isValid(new State({input: "123four"}))).to.be(false);

    expect(v3.isValid(new State({input: ""}))).to.be(false);
    expect(v3.isValid(new State({input: "hello"}))).to.be(true);
    expect(v3.isValid(new State({input: "hello world"}))).to.be(false);

    expect(v4.isValid(new State({input: ""}))).to.be(false);
    expect(v4.isValid(new State({input: "FL"}))).to.be(true);
    expect(v4.isValid(new State({input: "asdf"}))).to.be(false);

    expect(v5.isValid(new State({input: ""}))).to.be(false);
    expect(v5.isValid(new State({input: "one"}))).to.be(false);
    expect(v5.isValid(new State({input: "-123"}))).to.be(false);
    expect(v5.isValid(new State({input: "5"}))).to.be(true);
    expect(v5.isValid(new State({input: "123"}))).to.be(false);
    expect(v5.isValid(new State({input: "asdf"}))).to.be(false);

    expect(v6.isValid(new State({input: "asdf"}))).to.be(false);
    expect(v6.isValid(new State({input: "{a: 1, b: \"two\", c: [3]}"}))).to.be(true);
    expect(v6.isValid(new State({input: "{a: 1} something"}))).to.be(false);

  });

  it("Can Evaluate", function () {
    expect(v1.evaluate(new State(""))).to.not.be.ok();
    expect(v1.evaluate(new State("hello world")).matched).to.be("hello");
    expect(v1.evaluate(new State("hello world")).args.world).to.be("hello");
    expect(v1.evaluate(new State("hello world")).unmatched).to.be(" world");

    expect(v2.evaluate(new State(""))).to.not.be.ok();
    expect(v2.evaluate(new State("asdf"))).to.not.be.ok();
    expect(v2.evaluate(new State("123")).matched).to.be("123");
    expect(v2.evaluate(new State("123")).args.age).to.be(123);
    expect(v2.evaluate(new State("123 asdf")).args.age).to.be(123);

    expect(v3.evaluate(new State(""))).to.not.be.ok();
    expect(v3.evaluate(new State("hello world")).matched).to.be("hello");
    expect(v3.evaluate(new State("hello world")).args.name).to.be("hello!");
    expect(v3.evaluate(new State("hello world")).unmatched).to.be(" world");

    expect(v4.evaluate(new State(""))).to.not.be.ok();
    expect(v4.evaluate(new State("WA")).matched).to.be("WA");
    expect(v4.evaluate(new State("WA")).args.state).to.be("WA");
    expect(v4.evaluate(new State("WA world")).unmatched).to.be(" world");

    expect(v5.evaluate(new State(""))).to.not.be.ok();
    expect(v5.evaluate(new State("asdf"))).to.not.be.ok();
    expect(v5.evaluate(new State("-123"))).to.not.be.ok();
    expect(v5.evaluate(new State("5")).args.range).to.be(5);
    expect(v5.evaluate(new State("5 asdf")).args.range).to.be(5);
    expect(v5.evaluate(new State("5 asdf")).unmatched).to.be(" asdf");

    expect(v6.evaluate(new State(""))).to.not.be.ok();
    expect(v6.evaluate(new State("asdf"))).to.not.be.ok();
    expect(v6.evaluate(new State("{a: 1, b: \"two\", c: [3]}")).unmatched).to.be("");
    expect(v6.evaluate(new State("{a: 1, b: \"two\", c: [3]}")).args.settings.a).to.be(1);
    expect(v6.evaluate(new State("{a: 1, b: \"two\", c: [3]} asdf"))).to.not.be.ok();
  });

});
