var chalk = require("chalk");
var semver = require("semver");
var packageConfig = require("../package.json");

function exec(cmd) {
  return require("child_process")
    .execSync(cmd)
    .toString()
    .trim();
}

var versionRequirements = [
  {
    name: "node",
    currentVersion: semver.clean(process.version), //semver.clean('v8.17.0') #8.17.0解析版本號，忽略版本號前面的符號  (process对象是 Node 的一个全局对象，不需要使用require()載入即可使用)
    versionRequirement: packageConfig.engines.node
  },
  {
    name: "npm",
    currentVersion: exec("npm --version"), //相當於在terminal輸入npm --version #6.13.4
    versionRequirement: packageConfig.engines.npm
  }
];
console.log(exec("npm --version"));
module.exports = function() {
  var warnings = [];
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(
        mod.name +
        ": " +
        chalk.red(mod.currentVersion) + //紅字
          " should be " +
          chalk.green(mod.versionRequirement)
      );
    }
  }

  if (warnings.length) {
    console.log("");
    console.log(
      chalk.yellow(
        "To use this template, you must update following to modules:"
      )
    );
    console.log();
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i];
      console.log("  " + warning);
    }
    console.log();
    process.exit(1); //退出當前進程
  }
};
