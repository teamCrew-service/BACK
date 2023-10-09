// multerConfig.ts
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { basename, extname } from 'path';
import multerS3 from 'multer-s3';
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
//.env파일에 AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAMe을 입력하기위해 import함
require('dotenv').config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY || 'YOUR_ACCESS_KEY',
  secretAccessKey: process.env.AWS_SECRET_KEY || 'YOUR_SECRET_KEY',
  region: process.env.AWS_REGION || 'YOUR_REGION', // 예: 'us-west-1'
});

export const multerConfig2 = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = uuidv4();
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};

export const multerConfig = {
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'YOUR_BUCKET_NAME', // 환경 변수 또는 직접 값을 입력
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
    acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
    key: (req, file, cb) => {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
  // 파일 크기 제한 1mb
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
};
