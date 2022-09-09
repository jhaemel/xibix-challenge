'use strict';

const fs = require('fs');
const CalculateViewSpotsService = require('./calculateViewPointsService');

module.exports.calculateViewSpots = async (event) => {

  const fileNameWithAbsolutePath = event['fileNameWithAbsolutePath'];
  const numberOfViewSpots = event['numberOfViewSpots'];

  if (!numberOfViewSpots || !fileNameWithAbsolutePath) {
    return {
      'statusCode': 500,
      'body': {
        'message': 'Invalid number of parameters.'
      }
    }
  }

  if (!fs.existsSync(fileNameWithAbsolutePath)) {
    return {
      'statusCode': 404,
      'body': {
        'message': 'File not found.'
      }
    }
  }

  const results = new CalculateViewSpotsService().calculate(fileNameWithAbsolutePath, numberOfViewSpots);
  return {
    'statusCode': 200,
    'body': {
      'message': results
    }
  }
};
