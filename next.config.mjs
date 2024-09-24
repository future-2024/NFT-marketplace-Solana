// next.config.mjs

import dotenv from 'dotenv';

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['nftcollectionuploads.s3.amazonaws.com', 'nftuploads2.s3.amazonaws.com', 'nftcollectionuploads.s3.us-east-1.amazonaws.com','qn-shared.quicknode-ipfs.com'],
    },
    env: {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    },
};

export default nextConfig;
