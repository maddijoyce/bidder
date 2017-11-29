const S3 = require('aws-sdk/clients/s3');

module.exports = {
  s3: new S3({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    s3ForcePathStyle: true,
  }),
};
