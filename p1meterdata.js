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

//  Returns match group with index n as result from applying regex to data (string)
var returnRegExResult = function (data, regex, n) {
    var result = data.match(regex);

    if (result != undefined && typeof result[n] != 'undefined') {
        return result[n];
    } else {
        return undefined;
    }

};

var P1DataStream = function (opts,logger) {

    var self = this;
    self.opts = opts;

    var listener = function (data) {

        var tariffOneTotalUsage = returnRegExResult(data, /^1-0:1\.8\.1\(0+(\d+\.\d+)\*kWh\)/m, 1);
        var tariffTwoTotalUsage = returnRegExResult(data, /^1-0:1\.8\.2\(0+(\d+\.\d+)\*kWh\)/m, 1);
        var currentTariff = returnRegExResult(data, /^0-0:96.14.0\(0+(.*?)\)/m, 1);
        var currentUsage = returnRegExResult(data, /^1-0:1.7.0\((.*?)\*/m, 1);
        var gasTotalUsage = returnRegExResult(data, /^0-1:24\.3\.0(.*)\(m3\)[\r]?[\n]?\(0+(\d+\.\d+)\)/m, 2);

        var dataGram = {
            tariffOneTotalUsage: tariffOneTotalUsage * 1,
            tariffTwoTotalUsage: tariffTwoTotalUsage * 1,
            currentTariff: currentTariff * 1,
            currentUsage: currentUsage * 1000,
            gasTotalUsage: gasTotalUsage * 1
        };
	
        typeof logger === 'function' && logger(data);

        self.emit("data", dataGram);
    };

    openSerialPort(self.opts, listener);
    events.EventEmitter.call(self);
};

util.inherits(P1DataStream, events.EventEmitter);

module.exports = P1DataStream;
