#!/usr/bin/env node

// Import Statements
import minimist from "minimist";

// Process args and put them into 'args'
let args = minimist(process.argv.slice(2));

// If given the -h option in command line, show help msg and exit 0
help_msg(() => {
    if (args.h) {
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n\t-h            Show this help message and exit.\n\t-n, -s        Latitude: N positive; S negative.\n\t-e, -w        Longitude: E positive; W negative.\n\t-z            Time zone: uses tz.guess() from moment-timezone by default.\n\t-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n\t-j            Echo pretty JSON from open-meteo API and exit.')
    return(0);
}});