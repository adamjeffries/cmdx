"use strict";

const expect = require("expect.js");
const State = require("../../src/State.js");
const Delimiter = require("../../src/tokens/Delimiter");



describe("Delimiter", function () {

  let value = "@=#$%^&";
  let d = new Delimiter({value});

  it("Exposes Options", function () {
    expect(d.value).to.be(value);
  });

  it("Can Stringify", function () {
    expect(d.toString()).to.be(value);
  });

  it("Can convert to JSON", function () {
    let j = d.toJSON();
    expect(j.id).to.be.a("string");
    expect(j.value).to.be(value);
    expect(j.cname).to.be("Delimiter");
  });

  it("Can Validate", function () {
    expect(d.isValid(new State({input: ""}))).to.be(false);
    expect(d.isValid(new State({input: "he"}))).to.be(false);
    expect(d.isValid(new State({input: "asdf"}))).to.be(false);
    expect(d.isValid(new State({input: value}))).to.be(true);
    expect(d.isValid(new State({input: value + "earth"}))).to.be(false);
  });

  it("Can Evaluate", function () {
    expect(d.evaluate(new State("asdf"))).to.not.be.ok();
    expect(d.evaluate(new State(value)).unmatched).to.be("");
    expect(d.evaluate(new State(value + "mars")).unmatched).to.be("mars");
  });

});
