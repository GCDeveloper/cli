const assert = require("assert");
const processArgs = require("../processArgs.js");
const { spawn } = require("child_process");

describe("processArgs", function() {
  it("specifying an argument without a value should default it to true", function() {
    let jsonOutput = processArgs("--hello");
    assert.deepStrictEqual(jsonOutput, { hello: true });
    assert.notDeepStrictEqual(jsonOutput, { hello: undefined });
    assert.notDeepStrictEqual(jsonOutput, { hello: null });
    jsonOutput = processArgs(["world", "wide", "--web"]);
    assert.deepStrictEqual(jsonOutput, { world: true, wide: true, web: true });
  });
  it('specifying an argument with "--" should remove the "--" from the output json', function() {
    let jsonOutput = processArgs("--hello");
    assert.deepStrictEqual(jsonOutput, { hello: true });
    jsonOutput = processArgs(["--world", "--happy=days", "sunday=domingo"]);
    assert.deepStrictEqual(jsonOutput, {
      world: true,
      happy: "days",
      sunday: "domingo"
    });
  });
  it("strings with whitespace should still work", function() {
    let jsonOutput = processArgs("--world=today is a good day");
    assert.deepStrictEqual(jsonOutput, {
      world: "today is a good day"
    });
    jsonOutput = processArgs(`--world=today is a 
good day`);
    assert.deepStrictEqual(jsonOutput, {
      world: `today is a 
good day`
    });
  });
  it("order of arguments shouldn't matter", function() {
    let jsonOutput = processArgs(['--world="today is a good day"', "--hello"]);
    assert.deepStrictEqual(jsonOutput, {
      hello: true,
      world: "today is a good day"
    });
    jsonOutput = processArgs(["--hello", '--world="today is a good day"']);
    assert.deepStrictEqual(jsonOutput, {
      hello: true,
      world: "today is a good day"
    });
  });
  it("raw json arguments should be parsed", function() {
    const jsonInput = {
      example: "json",
      with: 123,
      data: true,
      types: { and: "deep nesting ", etc: false }
    };
    const jsonOutput = processArgs("myJson=" + JSON.stringify(jsonInput));
    assert.deepStrictEqual(jsonOutput, { myJson: jsonInput });
  });
});
describe("cli", function() {
  it("should output json when cli is used and input args directly", function(done) {
    console.warn("make sure json-args is installed when running this test.");
    const cli = spawn("json-args", ["hello=world"]);
    cli.stdout.on("data", data => {
      try {
        assert.deepStrictEqual(JSON.parse(data), { hello: "world" });
      } catch (err) {
        return done(err);
      }
      return done();
    });
  });
  it("should output json when cli is used and json input arg is given", function(done) {
    console.warn("make sure json-args is installed when running this test.");
    const cli = spawn("json-args", [
      "myJson=" + JSON.stringify({ hello: "world" })
    ]);
    cli.stdout.on("data", data => {
      try {
        assert.deepStrictEqual(JSON.parse(data), {
          myJson: { hello: "world" }
        });
      } catch (err) {
        return done(err);
      }
      return done();
    });
  });
});
