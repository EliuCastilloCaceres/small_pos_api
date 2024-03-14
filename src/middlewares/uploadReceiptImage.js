const multer = require('multer');
const path = require('path');
const receiptImageUploadConfig = multer.diskStorage({
    destination: path.join(__dirname,'../../public/images/receipt'),
    filename: function (req, file, cb) {
     
      const splitExtension = file.mimetype.split('/')
      const extension=`.${splitExtension[1]}`
      const randomPrefix = Math.round(Math.random() * 1E9)
      const prefix = randomPrefix
      console.log(file)
      return cb(null, prefix+'-'+Date.now()+extension)
      
    }
  })
  const receiptImgUpload = multer({ storage: receiptImageUploadConfig }).single('image');
  const noneUpload = multer().none()
  
  

  exports.receiptImgUpload = receiptImgUpload
  exports.noneUpload = noneUpload