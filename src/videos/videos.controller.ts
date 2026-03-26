/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
// src/videos/video.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { VideoService } from './videos.service';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}


  @Post('upload-url')
  upload(@Body() body: { fileName: string; contentType: string }) {
    return this.videoService.generateUploadUrl(
      body.fileName,
      body.contentType,
    );
  }

  @Get()
  list() {
    return this.videoService.listVideos();
  }
}