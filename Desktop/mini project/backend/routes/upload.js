const router = require('express').Router();
const multer = require('multer');

// Import controllers
const uploadController = require('../controllers/uploadController');
const filenameController = require('../controllers/filename');
const textDetectionController = require('../controllers/textDetection');
const { uploadPDF } = require('../controllers/pdfUpload');
const {shareLatestPDF} = require('../controllers/shareLatestPDF');
const { storeTicket, sendEmail } = require('../controllers/ticket');
const { getFile } = require('../controllers/getFile');

// Multer middleware for file uploads
const upload = multer({ dest: 'uploads/' });

// Define routes
router.post('/upload', upload.single('file'), uploadController.uploadFile);
router.get('/filename', filenameController.getFileName);
router.get('/text-detection', textDetectionController.processTextDetection);
router.post('/upload-pdf', upload.single('pdf'), uploadPDF);
router.post('/share-pdf',shareLatestPDF)
router.post('/store-ticket',storeTicket)
router.post('/send-email',sendEmail)
router.get('/get-image',getFile)
module.exports = router;
