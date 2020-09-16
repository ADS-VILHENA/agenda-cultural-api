import multer from 'multer';
import {v4 as uuidv4} from 'uuid';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/eventos");
    },
    filename: function(req, file, cb){
        cb(null, uuidv4() + "_" + file.originalname)
    }
});

const uploads = multer({storage: storage});

export default uploads;