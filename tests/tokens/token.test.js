"use strict";

const expect = require("expect.js");
const State = require("../../src/State.js");
const Token = require("../../src/tokens/Token");

describe("Token", function () {

  let t = new Token();

  it("Exposes Options", function () {
    expect(t.id).to.be.a("string");
  });

  it("Can Stringify", function () {
    expect(t.toString()).to.be("Token");
  });

  it("Can convert to JSON", function () {
    let j = t.toJSON();
    expect(j.id).to.be.a("string");
    expect(j.cname).to.be("Token");
  });

  it("Can Validate", function () {
    expect(t.isValid(new State({input: ""}))).to.be(false);
    expect(t.isValid(new State({input: "asdf"}))).to.be(false);
  });

  it("Can Evaluate", function () {
    expect(t.evaluate(new State("asdf"))).to.not.be.ok();
  });

});