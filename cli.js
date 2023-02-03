#!/usr/bin/env node

// Import Statements
import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

// Process args and put them into 'args'
let args = minimist(process.argv.slice(2));

// If given the -h option in command line, show help msg and exit 0
if (args.h) {
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n\t-h            Show this help message and exit.\n\t-n, -s        Latitude: N positive; S negative.\n\t-e, -w        Longitude: E positive; W negative.\n\t-z            Time zone: uses tz.guess() from moment-timezone by default.\n\t-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n\t-j            Echo pretty JSON from open-meteo API and exit.');
    process.exit(0);
}


// Extract system timezone
const timezone = moment.tz.guess();

// Use timezone args or auto timezone
if (args.z) {
    var timezone_to_use = args.z;
} else { var timezone_to_use = timezone; }

// Convert lat and long arguments to nums with only 2 decimal places
if (args.n) {
    var north = Math.round((args.n + Number.EPSILON) * 100) / 100;
}
if (args.s) {
    var south = Math.round((args.s + Number.EPSILON) * 100) / 100;
}
if (args.e) {
    var east = Math.round((args.e + Number.EPSILON) * 100) / 100;
}
if (args.w) {
    var west = Math.round((args.w + Number.EPSILON) * 100) / 100;
}


// If we do not have a lat and long measure
if (!((north && east) || (north && west) || (south && east) || (south && west))) {
    console.log('Latitude must be in range')
    process.exit(0);
}

// Make a request
if (args.n && args.e) {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + north + '&longitude=' + east + '&timezone=' + timezone_to_use + '&daily=precipitation_hours');
} else if (args.n && args.w) {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + north + '&longitude=-' + west + '&timezone=' + timezone_to_use + '&daily=precipitation_hours');
} else if (args.s && args.e) {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-' + south + '&longitude=' + east + '&timezone=' + timezone_to_use + '&daily=precipitation_hours');
} else {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-' + south + '&longitude=-' + west + '&timezone=' + timezone_to_use + '&daily=precipitation_hours');
}

// Get the data from the request, print it if -j was used
const data = await response.json();
if (args.j) {
    console.log(data);
    process.exit(0);
}

// Create phrase for day we're looking for
const days = args.d;

if (days == 0) {
    var day = "today.";
  } else if (days > 1) {
    var day = "in " + days + " days.";
  } else {
    var day = "tomorrow.";
  }


// Decide whether galoshes are needed on the given day

// if days & days != 1, use days as the index for getting data. else use 1 as the index
if (days && days != 1) {
    var precip = data.daily.precipitation_hours[days];
    if (precip == 0) {
        console.log("You will not need your galoshes " + day);
    } else {
        console.log("You might need your galoshes " + day);
    }
    
} else {
    var precip = data.daily.precipitation_hours[1];
    if (precip == 0) {
        console.log("You will not need your galoshes " + day);
    } else {
        console.log("You might need your galoshes " + day);
    }
}


