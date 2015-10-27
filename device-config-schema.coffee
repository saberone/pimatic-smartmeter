module.exports = {
  title: "pimatic-smartmeter device config schemas"
  Smartmeterdevice: {
    title: "Smartmeter config options"
    type: "object"
    extensions: ["xLink", "xAttributeOptions"]
    properties:
      serialport:
        description: "Serialport name (e.g. /dev/ttyUSB0)"
        type: "string"
        default: "/dev/ttyUSB0"
      baudRate:
        description: "Baudrate to use for communicating over serialport (e.g. 9600)"
        type: "integer"
        default: 9600
      dataBits:
        description: "Number of databits to use for communication over serialport (e.g. 7)"
        type: "integer"
        default: 7
      parity:
        description: "Parity to use for communication over serialport (can be 'none', 'even', 'mark', 'odd', 'space')"
        type: "string"
        default: "even"
      stopBits:
        description: "Number of stopBits to use for communication over serialport (can be 1 or 2)"
        type: "integer"
        default: 1
      flowControl:
        description: "Use flowControl for communication over serialport (can be true or false)"
        type: "boolean"
        default: true

  }
} 
