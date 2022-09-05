'use strict';

const fs = require('fs');

module.exports.hello = async (event) => {

  const fileName = event['fileName'];
  const numberOfViewSpots = event['numberOfViewSpots'];


  if (!numberOfViewSpots || !fileName) {
    return {
      'statusCode': 500,
      'body': {
        'message': 'Invalid parameters.'
      }
    }
  }

  const fileNameWithAbsolutePath = __dirname + fileName;

  if (!doesFileEists(fileNameWithAbsolutePath)) {
    return {
      'statusCode': 111,
      'body': {
        'message': 'File does not exist.'
      }
    }
  }

  const result = calculate(fileNameWithAbsolutePath, numberOfViewSpots);

  return {
    'statusCode': 200,
    'body': {
      'message': result
    }
  }
};


function doesFileEists(fileNameWithAbsolutePath) {
  return fs.existsSync(fileNameWithAbsolutePath);
}

function calculate(filefileNameWithAbsolutePathPath, numberOfViewSpots) {

  // paramter 1 - filename
  // paramter 2 - amount of view spots
  // const args = process.argv.slice(2);

  // console.log(JSON.parse(args[5]))

  // if (args.length !== 2) {
  //   console.error(`Invalid amount number of paramters. Expected 2 got ${args.length} paramters.`);
  //   process.exit();
  // }

  // const fileName = args[0];
  // const numberOfViewSpots = args[1];

  const startTime = performance.now();
  console.log('Starting calculations...');


  const rawData = fs.readFileSync(filefileNameWithAbsolutePathPath);
  const meshData = JSON.parse(rawData);

  const heightsIndexedByElementId = {};
  for (let heightElementData of meshData['values']) {
    heightsIndexedByElementId[heightElementData['element_id']] = heightElementData['value']
  }

  let results = [];

  let continueCounter = 0;

  parentLoop: for (let parentElement of meshData['elements']) {
    const parentElementId = parentElement['id'];
    const parentHeight = heightsIndexedByElementId[parentElementId];
    // let neighbourElementIds = [];
    for (const childElement of meshData['elements']) {
      const childElementId = childElement['id'];
      if (parentElementId === childElementId) {
        continue;
      }
      const hasAtLeastOneEqualNode = parentElement['nodes'].some(arrayValue => childElement['nodes'].includes(arrayValue));
      if (!hasAtLeastOneEqualNode) {
        continue;
      }
      // neighbourElementIds.push(childElementId + ' --- ' + heightsIndexedByElementId[childElementId]);
      if (parentHeight < heightsIndexedByElementId[childElementId]) {
        continueCounter++;
        continue parentLoop;
      }

    }
    results.push(
      {
        parent: parentElementId,
        values: parentHeight,
        // neighbours: neighbourElementIds
      }
    );
  }

  results.sort((a, b) => { return b.values - a.values });

  console.log('Continue counter:' + continueCounter)

  const calcualtionTime = Math.floor(performance.now() - startTime);
  console.log(`Calculations took ${calcualtionTime} milliseconds`);

  return results.slice(0, numberOfViewSpots);
}