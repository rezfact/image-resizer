// src/helpers/aws.helper.ts

import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsHelper {
  private readonly s3: AWS.S3;
  
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
  }

  async uploadToS3(file: any, bucketName: string, folderName: string): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${file.originalname}`,
      Body: file.buffer,
    };

    try {
      const { Location } = await this.s3.upload(params).promise();
      return Location;
    } catch (err) {
      throw new Error('Failed to upload image to S3.');
    }
  }
}
