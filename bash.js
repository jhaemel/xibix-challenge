const CalculateViewSpotsService = require('./calculateViewPointsService');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error(`Invalid amount of parameters. Expected 2, got ${args.length}.`);
    process.exit();
}

const fileNameWithAbsolutePath = args[0];
const numberOfViewSpots = args[1];

if (!fs.existsSync(fileNameWithAbsolutePath)) {
    console.error(`File not found.`);
    process.exit();
}

const results = new CalculateViewSpotsService().calculate(fileNameWithAbsolutePath, numberOfViewSpots);

console.log(results);
