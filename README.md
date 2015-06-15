pimatic-smartmeter
===============

[![Join the chat at https://gitter.im/saberone/pimatic-smartmeter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/saberone/pimatic-smartmeter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Reading "Smartmeter" energy usage through P1 port.

Installation
------------
To enable the smartmeter plugin add this to the plugins in the config.json file.

```
...
{
  "plugin": "smartmeter"
  
}
...
```

and add the following to the devices

```
{
  "id": "smartmeter",
  "class": "Smartmeterdevice",
  "name": "Smartmeter",
  "serialport": "/dev/ttyUSB0",
  "baudRate" : 9600,
  "dataBits" : 7,
  "parity" : "even",
  "stopBits" : 1,
  "flowControl" : true
}
```

Then install through the standard pimatic plugin install page.


Configuration
-------------
You can configure what serialport to use, and the serialport settings. You do this in the devices section, as you can see in the installation section.

