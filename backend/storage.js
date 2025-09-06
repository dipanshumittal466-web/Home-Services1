
const path = require('path');
const multer  = require('multer');

const provider = process.env.STORAGE_PROVIDER || 's3';

if(provider === 'cloudinary'){
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: 'homeservices/docs',
      resource_type: 'auto',
      public_id: Date.now() + '-' + file.originalname.replace(/\s+/g,'_')
    }),
  });
  const upload = multer({ storage });
  module.exports = {
    upload,
    getPublicUrl: (file) => file.path // cloudinary returns URL in file.path
  };
} else if(provider === 's3'){
  const multerS3 = require('@aws-sdk/lib-storage');
  const { S3Client } = require('@aws-sdk/client-s3');
  const multerS3Middleware = require('multer-s3');
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
  const upload = multer({
    storage: multerS3Middleware({
      s3,
      bucket: process.env.AWS_S3_BUCKET,
      contentType: multerS3Middleware.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, 'uploads/' + Date.now() + '-' + file.originalname.replace(/\s+/g,'_'));
      }
    })
  });
  module.exports = {
    upload,
    getPublicUrl: (file) => file.location // multer-s3 adds .location
  };
} else {
  // fallback disk (dev only)
  const storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null, path.join(__dirname,'public','uploads')),
    filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
  });
  const upload = multer({ storage });
  module.exports = {
    upload,
    getPublicUrl: (file) => '/uploads/' + file.filename
  };
}
