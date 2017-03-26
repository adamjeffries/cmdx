"use strict";

const expect = require("expect.js");
const State = require("../../src/State.js");
const Constant = require("../../src/tokens/Constant");



describe("Constant", function () {

  let c = new Constant({name: "helloworld"});

  it("Exposes Options", function () {
    expect(c.name).to.be("helloworld");
  });

  it("Can Stringify", function () {
    expect(c.toString()).to.be("helloworld");
  });

  it("Can convert to JSON", function () {
    let j = c.toJSON();
    expect(j.id).to.be.a("string");
    expect(j.name).to.be("helloworld");
    expect(j.cname).to.be("Constant");
  });

  it("Can Validate", function () {
    expect(c.isValid(new State({input: ""}))).to.be(false);
    expect(c.isValid(new State({input: "he"}))).to.be(false);
    expect(c.isValid(new State({input: "asdf"}))).to.be(false);
    expect(c.isValid(new State({input: "helloworld"}))).to.be(true);
    expect(c.isValid(new State({input: "helloworldearth"}))).to.be(false);
  });

  it("Can Evaluate", function () {
    expect(c.evaluate(new State("hello"))).to.not.be.ok();
    expect(c.evaluate(new State("helloworld")).unmatched).to.be("");
    expect(c.evaluate(new State("helloworld")).args.helloworld).to.be(true);
    expect(c.evaluate(new State("helloworldmars")).unmatched).to.be("mars");
    expect(c.evaluate(new State("helloworldmars")).args.helloworld).to.be(true);


  });

});
