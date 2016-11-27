var fs = require('fs-extra');
var path = require("path");
var host = require("./Host");
var buildTasks = require("./BuildTasks");
var config = require("./BuildConfig");

const nodeSpawn = require('child_process').spawn;

var atomicRoot = config.atomicRoot;
var buildDir = config.artifactsRoot + "Build/Windows/";
var editorAppFolder = config.editorAppFolder

namespace('cmake', function() {

  task('vs2017', {
    async: true
  }, function() {

    // Ensure we have a valid environment
    var vsdevcmd = config["vsdir"] + "Common7/Tools/VsDevCmd.bat";
    var cmake = config["vsdir"] + "Common7/IDE/CommonExtensions/Microsoft/CMake/CMake/bin/cmake.exe";

    if (!fs.existsSync(vsdevcmd)) {
      fail("\n\nVisual Studio 2017 VSDevCmd.bat not found at: " + vsdevcmd +  "\n\n");
    }

    if (!fs.existsSync(cmake)) {
      fail("\n\nVisual Studio 2017 cmake.exe not found at: " + cmake + "\n\n");
    }

    var basename = path.basename(atomicRoot);
    var dirname = path.dirname(atomicRoot);
    var solutionPath = dirname + "/" + basename + "-VS2017";

    // converts / to \ and removes trailing slash
    var fixpath = function(path) {
      return path.replace(/\//g, "\\").replace(/\\$/, "");
    }
    // we're using nodeSpawn here instead of jake.exe as the later was having much trouble with quotes
    var cmakeProcess = nodeSpawn("cmd.exe", ["/C",
                                 fixpath(atomicRoot + "\\Build\\Scripts\\Windows\\GenerateVS2017.bat"),
                                 fixpath(config["vsdir"]), fixpath(atomicRoot), fixpath(solutionPath)]);

    cmakeProcess.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    cmakeProcess.stderr.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    cmakeProcess.on('exit', (code) => {
      if (code != 0) {
        process.stdout.write(`CMake process exited with code ${code}`);
      }
      complete();
    });

  }, {
    printStdout: true,
    printStderr: true
  });

});// end of build namespace
