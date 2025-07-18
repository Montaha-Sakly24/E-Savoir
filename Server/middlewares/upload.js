import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname); 
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, name + ext); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images jpg, jpeg, png et webp sont autorisées'));
  }
};

const upload = multer({
  storage,
  fileFilter
});

export default upload;
