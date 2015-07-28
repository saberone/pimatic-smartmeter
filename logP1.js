#!/usr/bin/env node

var program = require('commander');
var P1DataStream = require ('./p1meterdata');
var fs = require('fs');

program
    .version('0.0.2')
    .description('Logs P1 smartmeter data to a file')
    .option('-p, --portname [portname]', 'Default portname is /dev/ttyUSB0', '/dev/ttyUSB0')
    .option('-b, --baudrate [baudrate]', 'Default baudrate is 9600', 9600)
    .option('-d, --databits [databits]', 'Default databits is 7', 7)
    .option('-pa, --parity [parity]', 'Default parity is even', 'even')
    .option('-sb, --stopbits [stopbits]', 'Default number of stopbits is 1', 1)
    .option('-f, --flowcontrol [true/false]', 'Default is true', true)
    .parse(process.argv);

program.on('--help', function(){
    console.log('  Example:');
    console.log('');
    console.log('    $ ./logP1.js -p /dev/ttyUSB0 -b 9600 -d 7 -pa even -sb 1 -f false');
    console.log('');
});

program.parse(process.argv);


if (!program.args.length) program.help();

var logfile = fs.createWriteStream('log.txt', {'flags': 'a'});
var logger = function(data) {
    logfile.write(data);
    logfile.write('\n');
};


p1datastream = new P1DataStream({
    portName: program.portname,
    baudRate: program.baudrate,
    dataBits: program.databits,
    parity: program.parity,
    stopBits: program.stopbits,
    flowControl: program.flowcontrol
},logger);
