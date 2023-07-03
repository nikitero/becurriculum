const multer = require('multer');
const path = require('path');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
// Esta función se utiliza para generar el nombre del archivo en el disco.
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);//
    },
//Esta función se utiliza para especificar la carpeta de destino donde se guardarán los archivos subidos.
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../temp'));
    }
  });

  const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];//formatos validos de imagen

  const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
    } else {
      cb(null, true);
    }
  }

const upload = multer({
  storage, //de donde se tienen que subir
  fileFilter, //que tipos de archivos se tienen que subir
});

const uploadToCloudinary = async (req, res, next) => {
	if (req.file) {
    try{
		const filePath = req.file.path;
    const image = await cloudinary.uploader.upload(filePath);

		// Removing the uploaded image on local
    await fs.unlinkSync(filePath);
	
		// Adding file_url property to the request
    req.file_url = image.secure_url;
		return next();
    }catch(error){
      return next(error)
    }
  } else {
    return next();
  }
};

module.exports = { upload: upload, uploadToCloudinary };