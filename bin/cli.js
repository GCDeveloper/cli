#!/usr/bin/env node

const cwd = process.cwd();
const path = require("path");
const processArgs = require("../processArgs.js");
//get command line arguments and process them
const args = process.argv.slice(2);
const verbose = false;
if (!args.length) {
  throw new Error(
    'Please specify a json file, JSON string, or arguments in the first argument.\r\nArguments must start with "--"'
  );
}
if (verbose) console.log("\r\nArguments:\r\n", args, "\r\n");
//determine if first argument is a file or json
const input = args[0];
if (verbose) console.log("Input", input);

function isFilename(f, format) {
  return typeof f == "string" && f.endsWith("." + format.toLowerCase());
}

function tryParseJSON(d, cb) {
  try {
    return JSON.parse(d);
  } catch (err) {
    return cb(err);
  }
}
//if is file
function getJsonInput(input) {
  let json = {};
  if (isFilename(input, "json")) {
    json = require(path.join(cwd, input));
  } else {
    json = tryParseJSON(input, err => {
      if (verbose) console.warn(err);
    });
    //input is neither .json nor JSON
    //therefore it may be raw arguments
    json = processArgs(args, {}, { verbose });
  }
  return json;
}

const cliCommands = getJsonInput(input);
if (verbose) console.log("Output:", cliCommands);
const processedArgs = processArgs(args.slice(1), cliCommands, { verbose });

if (verbose) console.log("Processed arguments:\r\n");
console.log(JSON.stringify(processedArgs));

module.exports = processArgs;
