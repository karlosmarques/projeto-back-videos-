/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/videos/video.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
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

  // 📤 gerar URL de upload
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

  // 📋 listar vídeos
  async listVideos() {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
    });

    const response = await this.s3.send(command);

    return response.Contents?.map((item) => ({
      name: item.Key,
      url: `https://f000.backblazeb2.com/file/${this.bucket}/${item.Key}`,
    }));
  }
}
