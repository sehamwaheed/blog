const multer = require('multer');


const MIME_TYPE_MAPS = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        const isValid = MIME_TYPE_MAPS[file.mimetype];
        let error = new Error('Invalid mime type')
        if (isValid) {
            error = null
        }
        cb(error, 'images');
    },
    filename: (request, file, cb) => {
        const name = file.originalname.toLowerCase().split('.').join('-');
        const ext = MIME_TYPE_MAPS[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

module.exports = multer({ storage: storage }).single("image");