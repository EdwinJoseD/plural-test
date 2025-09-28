import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validar que sea un archivo CSV
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});
