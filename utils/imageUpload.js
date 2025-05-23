const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const MAX_FILE_SIZE = 4 * 1024 * 1024;

let storage;
if (process.env.NODE_ENV === 'production') {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
    }
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
      const [name, ext] = file.originalname.split('.');
      cb(null, `${name}-${Date.now()}.${ext}`);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }
});

module.exports = upload;
