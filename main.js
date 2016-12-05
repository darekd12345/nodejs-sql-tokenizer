#!/usr/bin/env node
var colors = require('colors');

var analyser = require("./analyser");
var scanner = require("./scanner");

if (process.argv.length < 3) {
   console.log('ERROR: Enter valid path to SQL file.'.bold);
   process.exit(1);
}

filename = process.argv[2];

scanner.scan(filename);

process.exit(0);
