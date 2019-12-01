const assert = require("assert");
const jsonArgs = require("../processArgs.js");
const { spawn } = require("child_process");

describe("jsonArgs module", function() {
  it("specifying an argument without a value should default it to true", function() {
    let jsonOutput = jsonArgs("--hello");
    assert.deepStrictEqual(jsonOutput, { hello: true });
    assert.notDeepStrictEqual(jsonOutput, { hello: undefined });
    assert.notDeepStrictEqual(jsonOutput, { hello: null });
    jsonOutput = jsonArgs(["world", "wide", "--web"]);
    assert.deepStrictEqual(jsonOutput, { world: true, wide: true, web: true });
  });
  it('specifying an argument with "--" should remove the "--" from the output json', function() {
    let jsonOutput = jsonArgs("--hello");
    assert.deepStrictEqual(jsonOutput, { hello: true });
    jsonOutput = jsonArgs(["--world", "--happy=days", "sunday=domingo"]);
    assert.deepStrictEqual(jsonOutput, {
      world: true,
      happy: "days",
      sunday: "domingo"
    });
  });
  it("strings with whitespace should still work", function() {
    let jsonOutput = jsonArgs("--world=today is a good day");
    assert.deepStrictEqual(jsonOutput, {
      world: "today is a good day"
    });
    jsonOutput = jsonArgs(`--world=today is a 
good day`);
    assert.deepStrictEqual(jsonOutput, {
      world: `today is a 
good day`
    });
  });
  it("order of arguments shouldn't matter", function() {
    let jsonOutput = jsonArgs(['--world="today is a good day"', "--hello"]);
    assert.deepStrictEqual(jsonOutput, {
      hello: true,
      world: "today is a good day"
    });
    jsonOutput = jsonArgs(["--hello", '--world="today is a good day"']);
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
    const jsonOutput = jsonArgs("myJson=" + JSON.stringify(jsonInput));
    assert.deepStrictEqual(jsonOutput, { myJson: jsonInput });
  });
  it("should ignore args without -- if onlyDoubleDash is true in third argument of jsonArgs, else keep these args.", function() {
    let jsonOutput = jsonArgs(
      ["--hello=world", "--cat=animal", "--dog=animal", "simon=says"],
      {},
      { onlyDoubleDash: true }
    );
    assert.deepStrictEqual(jsonOutput, {
      hello: "world",
      cat: "animal",
      dog: "animal"
    });
    assert.notDeepStrictEqual(jsonOutput, {
      hello: "world",
      cat: "animal",
      dog: "animal",
      simon: "says"
    });
    jsonOutput = jsonArgs([
      "--hello=world",
      "--cat=animal",
      "--dog=animal",
      "simon=says"
    ]);
    assert.deepStrictEqual(jsonOutput, {
      hello: "world",
      cat: "animal",
      dog: "animal",
      simon: "says"
    });
  });
});
describe("json-args cli", function() {
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
