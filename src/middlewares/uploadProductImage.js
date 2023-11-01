const multer = require('multer');
const path = require('path');
const productImageUploadConfig = multer.diskStorage({
    destination: path.join(__dirname+'../../../public/images/products'),
    filename: function (req, file, cb) {
      const splitExtension = file.mimetype.split('/')
      const extension=`.${splitExtension[1]}`
      return cb(null, req.params.productId+extension)
    }
  })
  
  const productimgupload = multer({ storage: productImageUploadConfig }).single('image');

  exports.productimgupload = productimgupload