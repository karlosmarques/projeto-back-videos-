/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/videos/video.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class VideoService {
  private bucket = 'videos-streaming-karlos';

  constructor(
    @Inject('S3_CLIENT')
    private readonly s3: S3Client,
  ) {}

  async generateUploadUrl(fileName: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: 60 * 5,
    });

    return { url, fileName };
  }

  async listVideos() {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
    });

    const response = await this.s3.send(command);

    const videos = await Promise.all(
      (response.Contents ?? []).map(async (item) => {
        const signedUrl = await getSignedUrl(
          this.s3,
          new GetObjectCommand({
            Bucket: this.bucket,
            Key: item.Key,
          }),
          { expiresIn: 60 * 60 },
        );

        return {
          name: item.Key,
          url: signedUrl,
        };
      }),
    );

    return videos;
  }
}
