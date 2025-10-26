const multer = require("multer");

const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500000,
  },
});

module.exports = upload;
