// src/services/image-resize.service.ts

import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImageResizeService {
  async resizeImage(imageBuffer: Buffer, width: number, height: number) {
    const s3 = new AWS.S3();

    const resizedImage = await sharp(imageBuffer).resize(width, height).toBuffer();

    const outputPath = `resized_${width}x${height}_${Date.now()}.jpg`; // Using Date.now() to generate a unique filename

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: outputPath,
      Body: resizedImage,
    };

    try {
      await s3.upload(uploadParams).promise();
    } catch (error) {
      throw new Error(`Failed to upload the resized image to AWS S3: ${error.message}`);
    }

    return outputPath;
  }
}
