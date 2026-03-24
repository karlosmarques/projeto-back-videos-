/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoService } from './videos.service';
import { VideoController } from './videos.controller';
import { S3Provider } from './common/s3.provider';

@Module({
  controllers: [VideoController],
  providers: [VideoService, S3Provider],
  imports: [ConfigModule.forRoot()],
})
export class VideosModule {}
