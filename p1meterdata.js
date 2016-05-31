var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var util = require("util");
var events = require("events");


var openSerialPort = function (opts, callback) {
    console.log('serialport options ');
    console.log(opts);

    // Setup a SerialPort instance
    var sp = new SerialPort(opts.portName, {
        baudRate: opts.baudRate,
        dataBits: opts.dataBits,
        parity: opts.parity,
        stopBits: opts.stopBits,
        flowControl: opts.flowControl,
        parser: serialport.parsers.readline("!")
    }, false);

    sp.open(function () {
        console.log('- Serial port is open');
        sp.on('data', callback);
    });

    return sp;
};

//  Returns result from applying regex to data (string)
var returnRegExResult = function (data, regex) {
    var result = data.match(regex);

    if (result != undefined) {
        return result[1];
    } else {
        return undefined;
    }

};

var P1DataStream = function (opts,logger) {

    var self = this;
    self.opts = opts;

    var listener = function (data) {

        var tariffOneTotalUsage = returnRegExResult(data, /^1-0:1\.8\.1\((\d+\.\d+)\*kWh\)/m);
        var tariffTwoTotalUsage = returnRegExResult(data, /^1-0:1\.8\.2\((\d+\.\d+)\*kWh\)/m);
        var tariffOneTotalRetour = returnRegExResult(data, /^1-0:2\.8\.1\((\d+\.\d+)\*kWh\)/m);
        var tariffTwoTotalRetour = returnRegExResult(data, /^1-0:2\.8\.2\((\d+\.\d+)\*kWh\)/m);
        var currentTariff = returnRegExResult(data, /^0-0:96\.14\.0\((\d+)\)/m);
        var currentUsage = returnRegExResult(data, /^1-0:1\.7\.0\((\d+.\d+)\*kW\)/m);
        var currentRetour = returnRegExResult(data, /^1-0:2\.7\.0\((\d+.\d+)\*kW\)/m);
        var gasUsage = returnRegExResult(data, /^\((\d+\.\d+)\)/m);
        var gasValve = returnRegExResult(data, /^0-1:24\.4\.0\(([01])\)/m);

        var dataGram = {
            tariffOneTotalUsage: tariffOneTotalUsage * 1,
            tariffTwoTotalUsage: tariffTwoTotalUsage * 1,
            totalUsage: tariffOneTotalUsage * 1 + tariffTwoTotalUsage * 1,
            tariffOneTotalRetour: tariffOneTotalRetour * 1,
            tariffTwoTotalRetour: tariffTwoTotalRetour * 1,
            totalRetour: tariffOneTotalRetour * 1 + tariffTwoTotalRetour * 1,
            currentTariff: currentTariff * 1,
            currentUsage: currentUsage * 1000,
            currentRetour: currentRetour * 1000,
            gasUsage: gasUsage * 1,
            gasValve: (gasValve == 1) ? true : false
        };
	
        typeof logger === 'function' && logger(data);

        self.emit("data", dataGram);
    };

    openSerialPort(self.opts, listener);
    events.EventEmitter.call(self);
};

util.inherits(P1DataStream, events.EventEmitter);

module.exports = P1DataStream;
