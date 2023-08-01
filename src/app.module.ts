// src/app.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageResizeRouter } from './routes/image-resize.router';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Destination folder for uploaded images
    }),
    ImageResizeRouter, // Include the ImageResizeRouter here
  ],
})
export class AppModule {}
