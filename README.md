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


"It might work on your machine"-version
---------------------------------------
The current version has been tested on my own P1 smartmeter, and some Pimatic users have reported that it works for them too.
I cannot give any guarantees that it will work on every P1 smartmeter. But to try and improve support for different P1 smartmeters
, I have added a simple commandline node.js app/tool that dumps the P1 data straight to a file. Please share this dump if you want
your P1 smartmeter brand/model to be supported. Or better yet, fork + create pull request. ;)

Run the following commands from the root of this plugin.

```
npm install
chmod +x logP1.js
./logP1.js
```

If you have issues, please create an issue overe here : https://github.com/saberone/pimatic-smartmeter/issues
