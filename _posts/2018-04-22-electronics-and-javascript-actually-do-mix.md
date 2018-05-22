---
layout: post
title: Electronics and JavaScript Actually Do Mix
description: >
  My first impressions of the Johnny-Five platform
---

![arduino][arduino]


Since graduating with an EEE degree back in 2013, it's surprising how much the Arduino and Raspberry Pi wave has changed the hardware prototyping game and made electronics accessible to beginners. It is also somewhat surprising the way JavaScript (JS) has permeated beyond just making web pages more dynamic to even include hardware. Many of the tools we take for granted now were not necessarily available to me at the time of my studies, and this makes me envious of newcomers today. At the same time however, it is a reminder of how quickly technology proliferates, and provides yet another reason to be excited about the future.

During the NodeBots Workshop at [Conf & Coffee 2018][confAndCoffee], I went back to the basics and played around with the open source [Johnny-Five][johnnyFive] platform using an Arduino Uno. Johnny-Five itself is a Node.js library that allows you to create JS programs for a huge range of development boards, and focuses on being a robotics and IoT platform. It specifically relies on the [Firmata][firmata] protocol to communicate with microcontrollers on these boards, and also enables you to add compatibility for [your own boards][ioPlugins] too!

# Getting Started
To begin showing off some of Johnny-Five's power, here's how you can blink your LED every second:
~~~js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function () {  
    var led = new five.Led(13);
    led.blink(1000);
});
~~~

Very little code required as you can see!

As most web developers using JS would know, servicing asynchronous events is common place. So, it's not too surprising to find that we can use callbacks on events from inputs like buttons:
~~~js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function () {  
    var led = new five.Led(13);
    var button = new five.Button(5);

    button.on("press", function() {
        led.toggle();
    });
});
~~~

And for sensors like a photoresistors:

~~~js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function () {
    var led = new five.Led(13);
    var sensor = new five.Sensor("A0");

    sensor.on("change", function() {
        if(this.value > 600) { led.on(); }
        else { led.off(); }
    });
});
~~~

Already, you can see this is all quite a step up from the days of having to write a round-robin loop, tune the loop frequency, configure data direction registries and mask the right pins with bit manipulation.


# Client-Server Examples
Something else that took me by surprise is how easy it is to create a UDP client-server scenario. To demonstrate, I created a little client Node.js program for my computer to send empty datagrams on port 1337:

~~~js
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.send("", 1337, 'localhost', function(err) {
    console.error("Failed to send. Is your Arduino running 'server.js'?\n");
    client.close();
});
~~~

The server program running on the Arduino would then play a tune over a connected piezo speaker whenever a datagram was received via a connected USB cable:

~~~js
var dgram = require('dgram');
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function () {  
    var piezo = new five.Piezo(8);
    var server = dgram.createSocket('udp4');

    server.on('message', function() {
        piezo.play({
            song: [
                ["C4", 1 / 4],
                ["D4", 1 / 4],
                ["F4", 1 / 4],
                ["D4", 1 / 4],
                ["A4", 1 / 4],
                [null, 1 / 4],
                ["A4", 1],
                ["G4", 1],
                [null, 1 / 2],
                ["C4", 1 / 4],
                ["D4", 1 / 4],
                ["F4", 1 / 4],
                ["D4", 1 / 4],
                ["G4", 1 / 4],
                [null, 1 / 4],
                ["G4", 1],
                ["F4", 1],
                [null, 1 / 2]
            ],
            tempo: 100
        });
    });

    server.bind(1337);
});
~~~

Again, very simple! Most of the code is actually the notes of the song itself!

In a somewhat similar fashion, I played around with [dnode][dnode], an asynchronous RPC system for Node.js, to help with remote function calls. The client on the computer connects and calls a *getTemperature* function with a callback function argument that outputs a temperature:

~~~js
var dnode = require('dnode');

var d = dnode.connect(1337);
d.on('remote', function(remote) {
    remote.getTemperature(function(t) {
        console.log("Temperature is: " + t + "\n");
        d.end();
    });
});
~~~

The Arduino, or server, continuously updates a variable to keep track of the latest temperature from a connected sensor. Furthermore, the server also accepts any remote calls to its *getTemperature* that may have been made and executes the callback from the client with the latest temperature. The server code looks like this:

~~~js
var dnode = require('dnode');
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function () {  
    var therm = new five.Thermometer({
        controller: "TMP36",
        pin: "A0",
    });

    var temp = null;
    therm.on("change", function() {
        temp = this.C;
    });

    var server = dnode({
        getTemperature: function(cb) {
            cb(temp);
        }
    });
    server.listen(1337);
});
~~~


# Debugging
A neat thing I noticed is the *console* object can be used in code to be run on the board. This allows you to print to your Node.js terminal on your computer via USB, which is obviously very useful for debugging. Furthermore, through the power of REPL, you can execute code from the same terminal:

~~~js
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
    var led = new five.Led(13);

    this.repl.inject({
        // Allow limited on/off control access to the LED instance from the REPL.
        on: function() {
            led.on();
            console.log("LED is on");
        },
        off: function() {
            led.off();
            console.log("LED is off");
        }
    });
});
~~~

Just type the following into the Node.js terminal to turn the LED on then off:
~~~js
> on()
LED is on
>
> off()
LED is off
~~~


# Closing
I hope you enjoyed this short summary of my first hands-on experience with Johnny-Five. It certainly is a simple platform to get going on with some powerful features. If you're interested, more of my code from the workshop can be found [here](nodebotWorkshop).

<!-- Images -->
[arduino]: {{ site.url }}/assets/img/nodebotWorkshop.jpg

<!-- Links -->
[confAndCoffee]: 2018-04-21-conf-and-coffee-2018.md
[johnnyFive]: https://github.com/rwaldron/johnny-five
[ioPlugins]: https://github.com/rwaldron/IO-Plugins
[firmata]: https://github.com/firmata/protocol
[nodebotWorkshop]: https://github.com/akyidrian/nodebot-workshop
[dnode]: https://github.com/substack/dnode
