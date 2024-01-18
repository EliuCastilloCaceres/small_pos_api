const multer = require('multer');
const path = require('path');
const productImageUploadConfig = multer.diskStorage({
    destination: path.join(__dirname,'../../public/images/products'),
    filename: function (req, file, cb) {
     
      const splitExtension = file.mimetype.split('/')
      const extension=`.${splitExtension[1]}`
      const randomPrefix = Math.round(Math.random() * 1E9)
      const prefix = req.params.productId??randomPrefix
      console.log(file)
      return cb(null, prefix+'-'+Date.now()+extension)
      
    }
  })
  const productimgupload = multer({ storage: productImageUploadConfig }).single('image');
  const noneUpload = multer().none()
  
  

  exports.productimgupload = productimgupload
  exports.noneUpload = noneUpload