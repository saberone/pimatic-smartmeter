# #Plugin pimatic-smartmeter

module.exports = (env) ->
  Promise = env.require 'bluebird'

  #  assert = env.require 'cassert'

  class Smartmeter extends env.plugins.Plugin

    init: (app, @framework, @config) =>
      deviceConfigDef = require("./device-config-schema")

      @framework.deviceManager.registerDeviceClass("Smartmeterdevice", {
        configDef: deviceConfigDef.Smartmeterdevice,
        createCallback: (config) => new Smartmeterdevice(config)
      })

  class Smartmeterdevice extends env.devices.Sensor

    attributes:
      actualusage:
        description: "Actual usage"
        type: "number"
        unit: " Watt"
        acronym: "Actual usage"
      activetariff:
        description: "Active tariff"
        type: "number"
        unit: " 1 or 2"
      tariff1totalusage:
        description: "Tariff 1 total usage(T1)"
        type: "number"
        unit: " kWh"
      tariff2totalusage:
        description: "Tariff 2 total usage(T2)"
        type: "number"
        unit: " kWh"
      gastotalusage:
        description: "Gas total usage"
        type: "number"
        unit: "m3"
    actualusage: 0.0
    activetariff: 1
    tariff1totalusage: 0.0
    tariff2totalusage: 0.0
    gastotalusage: 0.0

    constructor: (config) ->

      @config = config

      @id = @config.id
      @name = @config.name
      @portName = @config.serialport
      @baudRate = @config.baudRate
      @dataBits = @config.dataBits
      @parity = @config.parity
      @stopBits = @config.stopBits
      @flowControl = @config.flowControl

      super()

      if @debug
        env.logger.debug ("Smartmeter portName : \"#{@portName}\"")
        env.logger.debug ("Smartmeter baudRate : \"#{@baudRate}\"")
        env.logger.debug ("Smartmeter dataBits : \"#{@dataBits}\"")
        env.logger.debug ("Smartmeter parity : \"#{@parity}\"")
        env.logger.debug ("Smartmeter stopBits : \"#{@stopBits}\"")


      P1DataStream = require "./p1meterdata"
      p1datastream = new P1DataStream({
        portName: @portName,
        baudRate: @baudRate,
        dataBits: @dataBits,
        parity: @parity,
        stopBits: @stopBits,
        flowControl: @flowControl
      })
      p1datastream.on 'data', (data) =>
        @actualusage = Number data.currentUsage
        @emit "actualusage", Number @actualusage

        @activetariff = Number data.currentTariff
        @emit "activetariff", Number @activetariff

        @tariff1totalusage = Number data.tariffOneTotalUsage
        @emit "tariff1totalusage", Number @tariff1totalusage

        @tariff2totalusage = Number data.tariffTwoTotalUsage
        @emit "tariff2totalusage", Number @tariff2totalusage

        @gastotalusage = Number data.gasTotalUsage
        @emit "gastotalusage", Number @gastotalusage

    getActualusage: -> Promise.resolve @actualusage
    getActivetariff: -> Promise.resolve @activetariff
    getTariff1totalusage: -> Promise.resolve @tariff1totalusage
    getTariff2totalusage: -> Promise.resolve @tariff2totalusage
    getGastotalusage: -> Promise.resolve @gastotalusage

  plugin = new Smartmeter
  return plugin
