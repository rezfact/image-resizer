// src/routers/image-resize.router.ts

import { Module } from '@nestjs/common';
import { ImageResizeController } from '../controllers/image-resize.controller';
import { ImageResizeService } from '../services/image-resize.service';
import { AwsHelper } from '../helpers/aws.helper';

@Module({
  controllers: [ImageResizeController],
  providers: [ImageResizeService, AwsHelper],
})
export class ImageResizeRouter {}

