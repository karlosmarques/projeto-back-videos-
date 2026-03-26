/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/common/s3.provider.ts
import { S3Client } from '@aws-sdk/client-s3';

export const S3Provider = {
  provide: 'S3_CLIENT',
  useFactory: () => {
    const accessKeyId = process.env.B2_KEY_ID;
    const secretAccessKey = process.env.B2_APPLICATION_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('B2_KEY_ID and B2_APPLICATION_KEY environment variables are required');
    }

    return new S3Client({
      endpoint: 'https://s3.us-east-005.backblazeb2.com',
      region: 'us-east-005',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  },
};
