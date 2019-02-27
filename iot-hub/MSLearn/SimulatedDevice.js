/**
 *  Copyright (c) Microsoft. All rights reserved.
 *  Licensed under the MIT license. See LICENSE file in the project root for full license information.
 */
'use strict'

/**
 * The Node.js Device SDK for IoT Hub: https://github.com/Azure/azure-iot-sdk-node
 * The sample connects to a device-specific MQTT endpoint on your IoT Hub.
 */
const Mqtt = require('azure-iot-device-mqtt').Mqtt
const DeviceClient = require('azure-iot-device').Client
const Message = require('azure-iot-device').Message

/**
 * The device connection string to authenticate the device with your IoT hub.
 *
 * NOTE:
 * For simplicity, this sample sets the connection string in code.
 * In a production environment, the recommended approach is to use
 * an environment variable to make it available to your application
 * or use an HSM or an x509 certificate.
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security
 *
 * Use the Azure CLI command:
 * az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id {MyIoTDeviceName} --output table
 */
const YOUR_CONNECTION_STRING = '{Your device connection string here}'

/**
 * By default, create and send a message every 1 second.
 * Change YOUR_INTERVAL to 10 to fire messages every .01 seconds.
 */
const YOUR_INTERVAL = 1000
const client = DeviceClient.fromConnectionString(YOUR_CONNECTION_STRING, Mqtt)

// Create and send a message repeatedly.
setInterval(() => {

  // Generate random constant.
  const RAND = Math.random()

  // Simulate weather data.
  const TEMPERATURE = 20 + RAND * 15
  const HUMIDITY = 60 + RAND * 20
  const DATE_TIME = new Date()

  // Generate condition-based messages.
  let levelValue
  if (RAND > .5) {
      if (RAND > .7) levelValue = "critical"
      else levelValue = "storage"
  } else levelValue = "normal"

  // Initialize device-to-cloud message.
  const message = new Message(JSON.stringify({
    "temperature": TEMPERATURE,
    "humidity": HUMIDITY,
    "timestamp": DATE_TIME.toISOString(),
    "pointInfo": `This is a ${levelValue} message.`
  }))

  /**
   * Add custom application properties to the message contingent on situational factors.
   * An IoT hub can filter on these properties without access to the message body.
   */
  message.properties.add('levelValue', `${levelValue}`)
  console.log(`Sending message: ${message.getData()}`)
  console.log(`Conditions are at ${levelValue} level`)

  // Send the message.
  client.sendEvent(message, err => {
    if (err) console.error(`send error: ${err.toString()}`);
    else console.log('message sent')
  })

}, YOUR_INTERVAL)