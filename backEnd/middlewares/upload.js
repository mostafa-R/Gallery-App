const multer = require('multer');
const fs = require("fs");

const DIR = './public/images';

if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/");
        let extension = extArray[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/png' ||  file.mimetype == 'image/jpeg') {
            cb(null, true)
        } else {
            cb(new multer.MulterError('not a picture'));
        }
    }
})



module.exports = upload;