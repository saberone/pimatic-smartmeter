#!/usr/bin/env node

var program = require('commander');
var P1DataStream = require ('./p1meterdata');
var fs = require('fs');

program
    .version('0.0.3')
    .description('Logs P1 smartmeter data to a file')
    .option('-p, --portname [portname]', 'Default portname is /dev/ttyUSB0', '/dev/ttyUSB0')
    .option('-b, --baudrate [baudrate]', 'Default baudrate is 9600', 9600)
    .option('-d, --databits [databits]', 'Default databits is 7', 7)
    .option('-a, --parity [parity]', 'Default parity is even', 'even')
    .option('-s, --stopbits [stopbits]', 'Default number of stopbits is 1', 1)
    .option('-f, --flowcontrol [true/false]', 'Default is true', 'true')
    .option('-l, --logfile [logfile]', 'Logfilename for P1 data. Default is p1smartmeter.log', 'p1smartmeter.log') 
    .parse(process.argv);

program.on('--help', function(){
    console.log('  Example:');
    console.log('');
    console.log('    $ ./logP1.js -p /dev/ttyUSB0 -b 9600 -d 7 -pa even -sb 1 -f false -l p1data.log');
    console.log('');
});

program.parse(process.argv);

console.log(program.logfile);


var logfile = fs.createWriteStream(__dirname + '/' + program.logfile, {'flags': 'a'});

process.on('exit', function () {
   logfile.end();
});


var logger = function(data) {
    logfile.write('---BEGIN--\n');
    logfile.write(data);
    logfile.write('---END----\n');
    console.log('Datagram written to ' + program.logfile);
};

p1datastream = new P1DataStream({
    portName: program.portname,
    baudRate: program.baudrate,
    dataBits: program.databits,
    parity: program.parity,
    stopBits: program.stopbits,
    flowControl: program.flowcontrol === 'true'
},logger);
