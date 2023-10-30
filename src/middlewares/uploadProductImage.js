const multer = require('multer');
const path = require('path');
const productImageUploadConfig = multer.diskStorage({
    destination: path.join(__dirname+'../../../public/images/products'),
    filename: function (req, file, cb) {
      return cb(null, file.originalname)
    }
  })
  
  const productimgupload = multer({ storage: productImageUploadConfig }).single('image');

  exports.productimgupload = productimgupload