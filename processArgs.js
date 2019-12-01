function processArgs(args = [], commands = {}, verbose) {
  if (typeof args == "string") args = [args];
  if (!Array.isArray(args)) {
    throw new Error("First argument must be an array.");
  }
  args.forEach(arg => {
    //remove -- from the key
    if (arg.startsWith("--")) {
      arg = arg.slice(2);
    }
    //if key doesn't include a =value then set it to the arg without --
    let key = arg;
    //default value of argument to true
    //e.g. the existence of --favouriteAnimal means its value is true
    let value = true;
    if (arg.includes("=")) {
      const indexOfDelimiter = arg.indexOf("=");
      arg = [arg.slice(0, indexOfDelimiter), arg.slice(indexOfDelimiter + 1)];
      if (verbose) console.log("Split args:", arg);
      //key is now what is before the = char
      key = arg[0];
      value = arg[1];
      //try catch so JSON.parse does not throw an error
      //if it cannot parse the value as JSON
      try {
        value = JSON.parse(value);
      } catch (err) {
        //Could not parse argument value as JSON.
        //It will be treated as a string.
      }
    }

    //set the argument in commands and its value
    commands[key] = value;
  });
  //return processed args using the commands object
  return commands;
}
module.exports = processArgs;
