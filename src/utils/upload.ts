import multer, { StorageEngine } from 'multer'
import path from 'path'

const UserStorage: StorageEngine = multer.diskStorage({
    filename: (req, file, cb) => {
        const fn = Date.now() + path.extname(file.originalname)
        cb(null, fn)
    }
})
const upload = multer({ storage: UserStorage }).single("photo")
export default upload