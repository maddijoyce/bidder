import { v4 } from 'uuid';

import ValidationError from '../error';
import { s3 } from '../../config/aws';

const extensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

export default {
  Mutation: {
    async signedUrl(root, { type }, context) {
      let upload;

      if (context && context.user) {
        const name = v4();
        const extension = extensions[type];
        if (extension) {
          const uploadUrl = s3.getSignedUrl('putObject', {
            Bucket: process.env.S3_BUCKET,
            Key: `${name}.${extension}`,
            Expires: 60,
            ContentType: type,
            ACL: 'public-read',
          });

          upload = {
            uploadUrl,
            imageUrl: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${name}.${extension}`,
          }
        } else {
          throw new ValidationError({ image: 'file type is invalid' });
        }
      }

      return upload;
    },
  },
};
