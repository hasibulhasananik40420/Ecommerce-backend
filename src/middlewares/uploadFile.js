

const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users'); // Folder to save the images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Naming the file with a timestamp
  }
});

// Initialize the upload middleware
const uploadUserImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2 MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

module.exports = uploadUserImage;
