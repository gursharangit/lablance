// lib/do-spaces-client.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export class DOSpacesClient {
  private client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.region = process.env.DO_SPACES_REGION || 'blr1';
    const accessKeyId = process.env.DO_SPACES_ACCESS_KEY;
    const secretAccessKey = process.env.DO_SPACES_SECRET_KEY;
    this.bucketName = process.env.DO_SPACES_BUCKET_NAME || 'labelingv2';

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Digital Ocean Spaces credentials are missing from environment variables');
    }

    this.client = new S3Client({
      region: this.region,
      endpoint: `https://${this.region}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: File, projectId: string): Promise<string> {
    try {
      const extension = file.name.split('.').pop();
      const uniqueId = uuidv4();
      const key = `projects/${projectId}/${uniqueId}.${extension}`;
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
      });

      await this.client.send(command);
      
      return `https://${this.bucketName}.${this.region}.digitaloceanspaces.com/${key}`;
    } catch (error) {
      console.error('Error uploading file to DO Spaces:', error);
      throw error;
    }
  }
}

export default new DOSpacesClient();

