'use strict';

const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

function approach_stables(callback) {
  // Comment or Delete the following line of code to remove simulated delay
  const isDelayed = true;

  AWSXRay.captureAsyncFunc('Approach Stables', (subsegment) => {
    if (typeof isDelayed !== 'undefined' && isDelayed) {
      setTimeout(function() {
        subsegment.close();
        callback();
      }, 2000);
    } else {
      subsegment.close();
      callback();
    }
  });
}

function list_unicorns(callback) {
  var params = {
    TableName: tableName
  };

  AWSXRay.captureAsyncFunc('List Unicorns', (subsegment) => {
    docClient.scan(params, function(err, data) {
      // Comment or Delete the following line of code to remove simulated error
      err = Error("something is wrong");

      if (err) {
        subsegment.close(err.message);
        callback(err);
      } else {
        subsegment.close();
        callback(null, data);
      }
    });
  });
}

exports.lambda_handler = (event, context, callback) => {
//  var segment = new AWSXRay.Segment('testlist');
//  AWSXRay.setSegment(segment);

  approach_stables(() => {
    list_unicorns((err, data) => {
      console.log("ERR: " + err);
      if (err) {
       // segment.close(err.message);
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ error: err.message })
        });
      } else {
  //      segment.close();
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(data.Items)
        });
      }
    })
  });
};
