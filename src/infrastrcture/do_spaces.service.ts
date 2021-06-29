import AWS from 'aws-sdk';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';

import { FileUploader } from 'src/application/file_uploader.service';
import { Configuration } from 'src/bootstrap/config/config';

@Injectable()
export class DigitalOceanSpacesUploader extends FileUploader {
  private readonly client: AWS.S3;

  private readonly bucket: string;

  private readonly endpoint: string;

  constructor(config: Configuration) {
    super();

    const endpoint = config.getStringOrThrow('DO_SPACES_ENDPOINT');
    const accessKeyId = config.getStringOrThrow('DO_SPACES_ACCESS_KEY_ID');
    const secretAccessKey = config.getStringOrThrow(
      'DO_SPACES_SECRET_ACCESS_KEY',
    );
    const bucket = config.getStringOrThrow('DO_SPACES_BUCKET');

    const credentials = new AWS.Credentials({
      accessKeyId,
      secretAccessKey,
    });

    this.client = new AWS.S3({ endpoint, credentials });
    this.bucket = bucket;
    this.endpoint = endpoint;
  }

  async upload(file: Buffer, name: string) {
    const putObject: (
      params: AWS.S3.PutObjectRequest,
    ) => Promise<AWS.S3.PutObjectOutput> = promisify(
      this.client.putObject,
    ).bind(this.client);

    const key = this.getKey(name);

    await putObject({
      Key: key,
      Body: file,
      Bucket: this.bucket,
      ACL: 'public-read',
    });

    return this.getPublicUrl(name);
  }

  private getPublicUrl(name: string): string {
    return `https://${this.bucket}.${this.endpoint}/${this.getKey(name)}`;
  }

  private getKey(name: string): AWS.S3.ObjectKey {
    return `yt-listen/${name}`;
  }
}
