import multer from "multer";
import * as uuid from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(__dirname);
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;

    const nameArray = originalName.split(".");
    const extension = nameArray[nameArray.length - 1];

    // console.log(req.cookies);
    const newFileName =
      req.cookies.storage_token + "-" + uuid.v1() + "." + extension;
    // const newFileName = uuid.v4() + "." + extension;

    cb(null, newFileName);
  },
});

export const upload = multer({
  storage: storage,
});
