// src/utils/uploadToS3.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

interface DropzoneFile extends File {
  path?: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const uploadToS3 = async (file: DropzoneFile, userId: string): Promise<string | null> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

  if (!bucketName) {
    console.error('Bucket name is not defined.');
    return null;
  }

  const params = {
    Bucket: bucketName,
    Key: `${userId}/${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params,
    });

    const data = await upload.done();
    return data.Location as string; // Ensure the return type is string
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return null;
  }
};

export default uploadToS3;
