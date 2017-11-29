require('dotenv/config');

const { s3 } = require('./aws');

s3.createBucket({ Bucket: process.env.S3_BUCKET }, () => {
  console.log('Bucket created successfully.');
  s3.putBucketCors({
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [{
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'POST', 'PUT'],
        AllowedOrigins: ['*'],
        ExposeHeaders: [],
        MaxAgeSeconds: 3000,
      }],
    },
  }, () => { console.log('Bucket CORS set successfully.')});
  s3.putBucketPolicy({
    Bucket: process.env.S3_BUCKET,
    Policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Sid: 'EveryoneReads',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${process.env.S3_BUCKET}/*`]
      }],
    }),
  }, () => { console.log('Bucket Policy set successfully.')});
});
