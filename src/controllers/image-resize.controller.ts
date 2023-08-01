// src/controllers/image-resize.controller.ts

import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageResizeService } from '../services/image-resize.service';
import { AwsHelper } from '../helpers/aws.helper'; // Import the AWS helper

@Controller('image')
export class ImageResizeController {
  constructor(
    private readonly imageResizeService: ImageResizeService,
    private readonly awsHelper: AwsHelper, // Add the AwsHelper
  ) {}

  @Post('resize')
  @UseInterceptors(FileInterceptor('image'))
  async resizeImage(@UploadedFile() file) {
    const { width, height } = { width: 300, height: 300 }; // You can change these dimensions as needed
    const outputPath = `resized_${width}x${height}_${file.originalname}`;

    // Process the image and get the resized image file buffer
    const resizedImageBuffer = await this.imageResizeService.resizeImage(file.buffer, width, height);

    // Upload the resized image to AWS S3
    const bucketName = process.env.AWS_BUCKET_NAME;
    const folderName = 'resized'; // Optional: You can create folders within the bucket
    const imageUrl = await this.awsHelper.uploadToS3(
      {
        buffer: resizedImageBuffer,
        originalname: file.originalname,
      },
      bucketName,
      folderName
    );

    return {
      originalImage: file.originalname,
      resizedImage: imageUrl,
    };
  }
}
